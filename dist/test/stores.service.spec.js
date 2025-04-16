"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const store_service_1 = require("../src/stores/store.service");
describe('StoresService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [store_service_1.StoresService],
        }).compile();
        service = module.get(store_service_1.StoresService);
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
        }
        else {
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
    it('should return stores by cep', async () => {
        const result = await service.getStoresByCep('50010-000');
        expect(result).toHaveProperty('stores');
        expect(result.total).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=stores.service.spec.js.map