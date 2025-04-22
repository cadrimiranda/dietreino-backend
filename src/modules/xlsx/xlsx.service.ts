import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  SheetData,
  SheetExercises,
  ExerciseInfo,
  RepRange,
} from './dto/sheet.type';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import { FileUpload } from 'graphql-upload-minimal';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

@Injectable()
export class XlsxService {
  /**
   * Processa um arquivo Excel e retorna apenas as abas não ocultas
   * @param buffer Buffer do arquivo Excel
   * @returns Array de objetos contendo nome da aba e dados
   */
  processXlsxFile(buffer: Buffer): SheetData[] {
    // Carrega o arquivo a partir do buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const result: SheetData[] = [];

    // Itera sobre todas as abas do arquivo
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      // Verifica se a aba está oculta (hidden === 0 significa não oculta,
      // hidden === 1 é oculta, hidden === 2 é muito oculta)
      const isHidden = workbook.Workbook?.Sheets?.find(
        (s) => s.name === sheetName,
      )?.Hidden;

      // Se a aba não estiver oculta, adiciona ao resultado
      if (isHidden === undefined || isHidden === 0) {
        // Converte os dados da planilha para um array de arrays
        const rawSheetData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
          raw: false, // Retorna strings em vez de números/datas
          defval: '', // Define um valor padrão para células vazias
          dateNF: 'yyyy-mm-dd', // Formato para datas
        });

        // Garantir que não haja valores nulos nas células
        const cleanSheetData = (rawSheetData || []).map((row) => {
          // Verificamos se row é nulo ou indefinido e retornamos um array vazio caso seja
          if (!row) return [''];

          // Para cada célula na linha, garantimos que não seja nula ou indefinida
          return row.map((cell) => {
            if (cell === null || cell === undefined) return '';
            return String(cell); // Converte qualquer valor para string
          });
        });

        // Filtrar linhas inteiramente vazias
        const filteredData = cleanSheetData.filter((row) => {
          // Uma linha é considerada vazia se todas as células estiverem vazias
          return row.some((cell) => cell.trim() !== '');
        });

        // Verificar se há alguma linha vazia (sem células)
        const finalData = filteredData.length > 0 ? filteredData : [['']];

        result.push({
          name: sheetName,
          data: finalData,
        });
      }
    });

    return result;
  }

  /**
   * Processa um arquivo XLSX a partir de um upload
   * @param upload Promise do arquivo carregado
   * @returns Dados processados do arquivo
   */
  async processXlsx(
    upload: Promise<FileUpload>,
  ): Promise<{ sheets: SheetData[] }> {
    const uploadResult = await upload;
    const tempFilename = `${uuid()}-${uploadResult.filename}`;
    const tempFilePath = join(process.cwd(), 'temp', tempFilename);

    if (!fs.existsSync(join(process.cwd(), 'temp'))) {
      fs.mkdirSync(join(process.cwd(), 'temp'), { recursive: true });
    }

    const writeStream = createWriteStream(tempFilePath);
    const readStream: fs.ReadStream = uploadResult.createReadStream();

    await new Promise<void>((resolve, reject) => {
      readStream
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', (error: unknown) => {
          const safeError =
            error instanceof Error
              ? error
              : new Error('Erro desconhecido ao escrever o arquivo.');
          reject(safeError);
        });
    });

    // Lê o arquivo para um buffer
    const buffer = fs.readFileSync(tempFilePath);

    // Processa o arquivo
    const sheets = this.processXlsxFile(buffer);

    // Remove o arquivo temporário
    fs.unlinkSync(tempFilePath);

    return { sheets };
  }

  /**
   * Extrai nomes de exercícios e esquemas de repetições de um arquivo XLSX
   * @param upload Promise do arquivo carregado
   * @returns Array de exercícios por folha com seus esquemas de repetições
   */
  async extractWorkoutSheet(
    upload: Promise<FileUpload>,
  ): Promise<SheetExercises[]> {
    // Utiliza o método processXlsx para obter todos os dados
    const processedData = await this.processXlsx(upload);

    // Array para armazenar os exercícios por folha
    const sheetExercises: SheetExercises[] = [];

    // Para cada planilha, extrai os nomes dos exercícios
    if (processedData && processedData.sheets) {
      processedData.sheets.forEach((sheet) => {
        // Map para armazenar exercícios com suas repetições, usando o nome como chave
        // para garantir unicidade
        const exercisesMap = new Map<string, ExerciseInfo>();
        let i = 1; // Começa da linha 1 (após o possível cabeçalho)

        let foundExercises = false;

        // Procura na planilha por blocos de exercícios
        while (i < sheet.data.length) {
          // Verifica se encontramos o início de um bloco de exercícios
          if (this.isExerciseRow(sheet.data[i])) {
            foundExercises = true;
            // Encontramos o início de um bloco de exercícios
            // Continua coletando até que o padrão pare
            while (i < sheet.data.length && this.isExerciseRow(sheet.data[i])) {
              const exerciseName = sheet.data[i][0].trim();
              const repsString = sheet.data[i][1].trim();

              // Parse das repetições
              const repSchemes = this.parseRepetitions(repsString);

              const restString = sheet.data[i][2]?.trim() || '';
              const restIntervals = this.parseRestIntervals(restString);

              // Armazena o exercício com as repetições no map
              exercisesMap.set(exerciseName, {
                name: exerciseName,
                rawReps: repsString,
                repSchemes,
                restIntervals,
              });

              i++;
            }

            // Aqui o bloco de exercícios terminou, então prosseguimos para encontrar o próximo bloco
          } else {
            // Se já encontramos exercícios, significa que estamos no final do bloco
            // e não precisamos continuar procurando
            if (foundExercises) {
              foundExercises = false;
              break;
            }

            // Não é um exercício, continua procurando
            i++;
          }
        }

        // Se existirem exercícios nesta folha, adicione-os ao resultado
        if (exercisesMap.size > 0) {
          sheetExercises.push({
            sheetName: sheet.name,
            exercises: Array.from(exercisesMap.values()).sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
          });
        }
      });
    }

    return sheetExercises;
  }

  // Função auxiliar para verificar se uma linha representa um exercício
  private isExerciseRow(row: string[]): boolean {
    // Verifica se a linha existe e tem pelo menos duas colunas
    if (!row || row.length < 2) {
      return false;
    }

    const possibleExerciseName = row[0];
    const possibleReps = row[1];

    // Verifica se o nome do exercício é válido e se a célula adjacente contém um número (repetições)
    return !!(
      possibleExerciseName &&
      typeof possibleExerciseName === 'string' &&
      possibleExerciseName.trim() !== '' &&
      possibleReps &&
      !isNaN(Number(possibleReps))
    );
  }

  /**
   * Analisa uma string de repetições e devolve um array de objetos RepRange.
   * Suporta formatos como:
   * - "1x 10 a 12/ 2x 8 a 10"
   * - "2x 8 a 10/ 2x 6 a 8"
   * - "8 a 10"
   * - "10" (apenas um número)
   * - "1x10 a 12" (sem espaço após o x)
   */
  private parseRepetitions(repsString: string): RepRange[] {
    const result: RepRange[] = [];

    // Se a string estiver vazia ou não for válida, retorna array vazio
    if (!repsString || typeof repsString !== 'string') {
      return result;
    }

    // Separa diferentes esquemas (divididos por /)
    const schemes = repsString
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const scheme of schemes) {
      try {
        // Verifica se o esquema tem o formato "Nx X a Y" ou apenas "X a Y"
        let sets = 1; // Valor padrão se não especificado
        let repsRange = scheme;

        // Verifica se há especificação de séries (formato: "Nx..." ou "Nx ...")
        // Ajustado para aceitar com ou sem espaço após o 'x'
        const setsMatch = scheme.match(/^(\d+)x\s*(.+)$/);
        if (setsMatch) {
          sets = parseInt(setsMatch[1], 10);
          repsRange = setsMatch[2].trim();
        }

        // Extrai o range de repetições (formato: "X a Y")
        const repsRangeMatch = repsRange.match(/(\d+)\s*a\s*(\d+)/);

        if (repsRangeMatch) {
          // Formato "X a Y"
          const minReps = parseInt(repsRangeMatch[1], 10);
          const maxReps = parseInt(repsRangeMatch[2], 10);

          result.push({ sets, minReps, maxReps });
        } else {
          // Pode ser apenas um número (ex: "10")
          const singleRep = parseInt(repsRange, 10);
          if (!isNaN(singleRep)) {
            result.push({ sets, minReps: singleRep, maxReps: singleRep });
          }
        }

        // Log para debug
        console.log(
          `Parsed scheme "${scheme}" into:`,
          result[result.length - 1],
        );
      } catch (error) {
        // Em caso de erro na análise, ignora este esquema
        console.error(
          `Erro ao analisar esquema de repetições: ${scheme}`,
          error,
        );
      }
    }

    return result;
  }

  /**
   * Analisa uma string de descanso e devolve um array de strings contendo os intervalos em segundos.
   * Suporta formatos como:
   * - "60s"
   * - "1min"
   * - "2min"
   * - "1:30"
   * - "2:00"
   * - "60s - 90s"
   * - "1min - 2min"
   */
  private parseRestIntervals(restString: string): string[] {
    // Se a string estiver vazia, retorna um array vazio
    if (!restString || restString.trim() === '') {
      return [];
    }

    // Verifica se é um intervalo (contém "-")
    if (restString.includes('-')) {
      const [start, end] = restString.split('-').map((s) => s.trim());
      const startSeconds = convertToSeconds(start);
      const endSeconds = convertToSeconds(end);

      return [`${startSeconds}s - ${endSeconds}s`];
    } else {
      // É um valor único
      const seconds = convertToSeconds(restString);
      return [`${seconds}s`];
    }

    /**
     * Converte uma string de tempo para segundos
     * @param timeString - A string de tempo a ser convertida
     * @returns O tempo em segundos
     */
    function convertToSeconds(timeString: string): number {
      // Verifica se é no formato "Xs" (Ex: "60s")
      if (/^\d+s$/.test(timeString)) {
        return parseInt(timeString.replace('s', ''), 10);
      }

      // Verifica se é no formato "Xmin" (Ex: "1min")
      if (/^\d+min$/.test(timeString)) {
        return parseInt(timeString.replace('min', ''), 10) * 60;
      }

      // Verifica se é no formato "X:Y" (Ex: "1:30")
      if (/^\d+:\d+$/.test(timeString)) {
        const [minutes, seconds] = timeString.split(':').map(Number);
        return minutes * 60 + seconds;
      }

      // Tenta converter diretamente para número, assumindo que é em segundos
      const parsed = parseInt(timeString, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }

      // Se não conseguir identificar o formato, retorna 0
      return 0;
    }
  }
}
