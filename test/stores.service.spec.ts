import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from '../src/stores/store.service'; // Certifique-se de que o caminho está correto!

describe('StoresService', () => {
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoresService],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all stores', () => {
    const result = service.getAllStores();
    expect(result).toHaveProperty('stores');
    expect(result.total).toBeGreaterThan(0);
  });

  it('should return a store by id', () => {
    const store = service.getStoreById('1');
    expect(store).toBeDefined();
    if ('storeID' in store) {
      expect(store.storeID).toBe('1');
    } else {
      fail('Expected store to have a storeID, but got an error object');
    }
  });

  it('should return stores by state', () => {
    const result = service.getStoresByState('PE');
    expect(result.stores).toBeInstanceOf(Array);
    result.stores.forEach((store) => {
      expect(store.state).toEqual('PE');
    });
  });

  // Se tiver método assíncrono getStoresByCep, você pode testar assim:
  it('should return stores by cep', async () => {
    // Aqui você pode usar um cep válido ou simulado
    const result = await service.getStoresByCep('50010-000');
    expect(result).toHaveProperty('stores');
    expect(result.total).toBeGreaterThan(0);
  });
});
