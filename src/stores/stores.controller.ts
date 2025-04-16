import { Controller, Get, Param } from '@nestjs/common';
import { StoresService } from './store.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  getAllStores() {
    return this.storesService.getAllStores();
  }

  @Get('/cep/:cep')
  async getStoresByCep(@Param('cep') cep: string) {
    return await this.storesService.getStoresByCep(cep);
  }

  @Get('/state/:state')
  getStoresByState(@Param('state') state: string) {
    return this.storesService.getStoresByState(state);
  }

  @Get('/:id')
  getStoreById(@Param('id') id: string) {
    return this.storesService.getStoreById(id);
  }
}

