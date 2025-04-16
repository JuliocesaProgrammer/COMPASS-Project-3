import { StoresService } from './stores.service';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    getAllStores(): Promise<{
        storeName: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        state: string;
    }[]>;
    getStoresByCep(cep: string): Promise<{
        stores: {
            name: string;
            city: any;
            postalCode: string;
            type: string;
            distance: string;
            value: {
                description: string;
                prazo: string;
                price: string;
            }[];
        }[];
        limit: number;
        offset: number;
        total: number;
    }>;
    getStoresByState(state: string): Promise<{
        storeName: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        state: string;
    }[]>;
    getStoreById(id: string): Promise<{
        storeName: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        state: string;
    }>;
}
