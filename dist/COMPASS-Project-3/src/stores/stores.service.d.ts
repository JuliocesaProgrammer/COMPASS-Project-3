export declare class StoresService {
    private lojas;
    getAllStores(): Promise<{
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
    getStoresByState(state: string): Promise<{
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
    calcularFreteMelhorEnvio(origemCep: string, destinoCep: string): Promise<any>;
    getAddressByCep(cep: string): Promise<any>;
    getCoordsFromCep(cep: string): Promise<{
        lat: any;
        lng: any;
    }>;
    calculateDistance(coord1: {
        lat: number;
        lng: number;
    }, coord2: {
        lat: number;
        lng: number;
    }): number;
}
