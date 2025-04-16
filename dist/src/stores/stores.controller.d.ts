import { StoresService } from './store.service';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    getAllStores(): {
        stores: {
            storeID: string;
            storeName: string;
            type: string;
            shippingTimeInDays: number;
            latitude: string;
            longitude: string;
            postalCode: string;
            state: string;
        }[];
        limit: number;
        offset: number;
        total: number;
    };
    getStoresByCep(cep: string): Promise<{
        error: string;
        stores?: undefined;
        limit?: undefined;
        offset?: undefined;
        total?: undefined;
    } | {
        stores: {
            name: string;
            city: any;
            postalCode: string;
            type: string;
            distance: string;
            value: Promise<{
                description: string;
                codProdutoAgencia: string;
                prazo: string;
                price: string;
            }[]>;
        }[];
        limit: number;
        offset: number;
        total: number;
        error?: undefined;
    }>;
    getStoresByState(state: string): {
        stores: {
            storeID: string;
            storeName: string;
            type: string;
            shippingTimeInDays: number;
            latitude: string;
            longitude: string;
            postalCode: string;
            state: string;
        }[];
        limit: number;
        offset: number;
        total: number;
    };
    getStoreById(id: string): {
        storeID: string;
        storeName: string;
        type: string;
        shippingTimeInDays: number;
        latitude: string;
        longitude: string;
        postalCode: string;
        state: string;
    } | {
        error: string;
    };
}
