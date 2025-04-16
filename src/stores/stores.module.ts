import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './store.service';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
