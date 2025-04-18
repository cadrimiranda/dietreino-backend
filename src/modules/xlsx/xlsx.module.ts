import { Module } from '@nestjs/common';
import { XlsxService } from './xlsx.service';
import { XlsxResolver } from './xlsx.resolver';

@Module({
  providers: [XlsxService, XlsxResolver],
  exports: [XlsxService],
})
export class XlsxModule {}
