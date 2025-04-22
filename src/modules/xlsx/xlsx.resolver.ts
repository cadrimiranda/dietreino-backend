/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { XlsxService } from './xlsx.service';
import { XlsxData, SheetExercises } from './dto/sheet.type';
import { FileUpload } from 'graphql-upload-minimal';

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
    return this.xlsxService.processXlsx(upload);
  }

  @Mutation(() => [SheetExercises])
  async extractWorkoutSheet(
    @Args({ name: 'file', type: () => GraphQLUpload })
    upload: Upload,
  ): Promise<SheetExercises[]> {
    return this.xlsxService.extractWorkoutSheet(upload);
  }
}
