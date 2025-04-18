import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { SheetData } from './dto/sheet.type';

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
   * Extrai o índice da coluna que tem o cabeçalho "Exercício"
   * @param headerRow Array representando a linha de cabeçalho
   * @returns O índice da coluna ou -1 se não encontrado
   */
  private findExerciseColumnIndex(headerRow: string[]): number {
    if (!headerRow || !Array.isArray(headerRow)) {
      return -1;
    }

    return headerRow.findIndex((header) => {
      if (header === undefined || header === null) {
        return false;
      }
      const headerText = String(header).toLowerCase().trim();
      return headerText === 'exercício' || headerText === 'exercicio';
    });
  }

  /**
   * Extrai apenas os nomes dos exercícios de um arquivo Excel
   * @param buffer Buffer do arquivo Excel
   * @returns Array de strings com os nomes dos exercícios
   */
  extractExerciseNames(buffer: Buffer): string[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const exerciseNames: string[] = [];

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const isHidden = workbook.Workbook?.Sheets?.find(
        (s) => s.name === sheetName,
      )?.Hidden;

      // Só processa abas não ocultas
      if (isHidden === undefined || isHidden === 0) {
        const data = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
          raw: false,
        });

        if (data.length >= 2) {
          // Pelo menos linha de cabeçalho e uma linha de dados
          const headerRow = data[0].map((cell) => String(cell || ''));
          const exerciseColumnIndex = this.findExerciseColumnIndex(headerRow);

          if (exerciseColumnIndex !== -1) {
            // Começar da linha 1 (pular o cabeçalho)
            for (let i = 1; i < data.length; i++) {
              const row = data[i];
              if (row && exerciseColumnIndex < row.length) {
                const exerciseName = String(
                  row[exerciseColumnIndex] || '',
                ).trim();
                if (exerciseName) {
                  exerciseNames.push(exerciseName);
                }
              }
            }
          }
        }
      }
    });

    // Remove duplicatas
    return [...new Set(exerciseNames)];
  }
}
