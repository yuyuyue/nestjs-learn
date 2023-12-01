import { Module } from '@nestjs/common';
import { ArconService } from './arcon.service';

@Module({
  providers: [ArconService],
})
export class ArconModule {}
