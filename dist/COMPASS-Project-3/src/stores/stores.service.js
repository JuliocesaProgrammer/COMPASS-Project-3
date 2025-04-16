"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
let StoresService = class StoresService {
    lojas = [
        {
            storeName: 'Loja Recife',
            postalCode: '50010-000',
            latitude: -8.0476,
            longitude: -34.877,
            state: 'PE',
        },
        {
            storeName: 'Loja São Paulo',
            postalCode: '01000-000',
            latitude: -23.5505,
            longitude: -46.6333,
            state: 'SP',
        },
    ];
    async getAllStores() {
        return this.lojas;
    }
    async getStoreById(id) {
        return this.lojas[+id];
    }
    async getStoresByState(state) {
        return this.lojas.filter((store) => store.state === state);
    }
    async getStoresByCep(cep) {
        const addressData = await this.getAddressByCep(cep);
        const userCoords = await this.getCoordsFromCep(cep);
        const storesWithFreight = await Promise.all(this.lojas.map(async (store) => {
            const storeCoords = { lat: store.latitude, lng: store.longitude };
            const distance = this.calculateDistance(storeCoords, userCoords);
            let value = [];
            if (store.postalCode !== cep) {
                value = await this.calcularFreteMelhorEnvio(store.postalCode, cep);
            }
            else {
                value = [
                    {
                        description: 'Motoboy',
                        prazo: '1 dia útil',
                        price: 'R$ 15,00',
                    },
                ];
            }
            return {
                name: store.storeName,
                city: addressData.localidade || 'Indefinida',
                postalCode: store.postalCode,
                type: 'LOJA',
                distance: `${distance.toFixed(1)} km`,
                value,
            };
        }));
        return {
            stores: storesWithFreight,
            limit: storesWithFreight.length,
            offset: 0,
            total: storesWithFreight.length,
        };
    }
    async calcularFreteMelhorEnvio(origemCep, destinoCep) {
        const token = process.env.MELHOR_ENVIO_TOKEN;
        if (!token) {
            console.error('Token do Melhor Envio não definido');
            return [];
        }
        try {
            const response = await axios_1.default.post('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', [
                {
                    from: { postal_code: origemCep.replace('-', '') },
                    to: { postal_code: destinoCep.replace('-', '') },
                    package: {
                        weight: 1,
                        width: 15,
                        height: 10,
                        length: 20,
                    },
                    services: ['1', '2'],
                },
            ], {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.map((item) => ({
                description: item.name,
                codProdutoAgencia: item.id,
                prazo: `${item.delivery_time.days} dias útis`,
                price: `R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`,
            }));
        }
        catch (error) {
            console.error('Erro ao calcular com Melhor Envio:', error.message || error);
            return [];
        }
    }
    async getAddressByCep(cep) {
        try {
            const response = await axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar endereço por CEP:', error.message);
            return {};
        }
    }
    async getCoordsFromCep(cep) {
        try {
            const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
            };
        }
        catch (error) {
            console.error('Erro ao obter coordenadas:', error.message);
            return { lat: 0, lng: 0 };
        }
    }
    calculateDistance(coord1, coord2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLon = toRad(coord2.lng - coord1.lng);
        const lat1 = toRad(coord1.lat);
        const lat2 = toRad(coord2.lat);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)()
], StoresService);
//# sourceMappingURL=stores.service.js.map