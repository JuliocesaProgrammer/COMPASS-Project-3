export declare class StoresService {
    private stores;
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
    calcularFreteCorreios(origem: string, destino: string): Promise<{
        description: string;
        codProdutoAgencia: string;
        prazo: string;
        price: string;
    }[]>;
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
    calculateDistance(coord1: {
        lat: number;
        lng: number;
    }, coord2: {
        lat: number;
        lng: number;
    }): number;
}
