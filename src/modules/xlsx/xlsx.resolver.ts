/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { XlsxService } from './xlsx.service';
import {
  XlsxData,
  SheetExercises,
  ExerciseInfo,
  RepRange,
} from './dto/sheet.type';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import { FileUpload } from 'graphql-upload-minimal';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

// Importe o GraphQLUpload como um objeto em vez de um tipo
import { GraphQLUpload } from 'graphql-upload-minimal';

type Upload = Promise<FileUpload>;

@Resolver()
export class XlsxResolver {
  constructor(private readonly xlsxService: XlsxService) {}

  @Mutation(() => XlsxData)
  async processXlsx(
    @Args({ name: 'file', type: () => GraphQLUpload })
    upload: Upload,
  ): Promise<XlsxData> {
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
    const sheets = this.xlsxService.processXlsxFile(buffer);

    // Remove o arquivo temporário
    fs.unlinkSync(tempFilePath);

    return { sheets };
  }

  @Mutation(() => [SheetExercises])
  async extractExerciseNames(
    @Args({ name: 'file', type: () => GraphQLUpload })
    upload: Upload,
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
              const seriesString = sheet.data[i][2]?.trim();

              // Parse das repetições
              const repSchemes = this.parseRepetitions(seriesString);

              // Verifica e corrige caso o número de sets seja menor que o indicado em repsString
              const totalSets = repSchemes.reduce(
                (sum, scheme) => sum + scheme.sets,
                0,
              );
              const expectedSets = Number(repsString);

              if (!isNaN(expectedSets) && totalSets < expectedSets) {
                const missingSets = expectedSets - totalSets;

                if (repSchemes.length > 0) {
                  repSchemes[0].sets += missingSets;
                } else {
                  repSchemes.push({
                    sets: missingSets,
                    minReps: 8,
                    maxReps: 10,
                  });
                }
              }

              // Armazena o exercício com as repetições no map
              exercisesMap.set(exerciseName, {
                name: exerciseName,
                rawReps: repsString,
                repSchemes,
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
            exercises: Array.from(exercisesMap.values()),
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

    console.log('Parsing:', repsString);

    if (!repsString || typeof repsString !== 'string') {
      return result;
    }

    const schemes = repsString
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const scheme of schemes) {
      try {
        let sets = 1;
        let repsRange = scheme;

        const setsMatch = scheme.match(/^(\d+)x\s*(.+)$/);
        if (setsMatch) {
          sets = parseInt(setsMatch[1], 10);
          repsRange = setsMatch[2].trim();
        }

        const repsRangeMatch = repsRange.match(/(\d+)\s*a\s*(\d+)/i);
        if (repsRangeMatch) {
          const minReps = parseInt(repsRangeMatch[1], 10);
          const maxReps = parseInt(repsRangeMatch[2], 10);
          result.push({ sets, minReps, maxReps });
          console.log(`Parsed scheme "${scheme}":`, { sets, repsRange });
          console.log('RepRange:', result[result.length - 1]);
        } else {
          const singleRep = parseInt(repsRange, 10);
          if (!isNaN(singleRep)) {
            result.push({ sets, minReps: singleRep, maxReps: singleRep });
            console.log(`Parsed scheme "${scheme}":`, { sets, repsRange });
            console.log('RepRange:', result[result.length - 1]);
          }
        }
      } catch (error) {
        console.error(
          `Erro ao analisar esquema de repetições: ${scheme}`,
          error,
        );
      }
    }

    return result;
  }
}
