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
const correios_brasil_1 = require("correios-brasil");
let StoresService = class StoresService {
    constructor() {
        this.stores = [
            {
                storeID: '1',
                storeName: 'Loja Recife',
                type: 'PDV',
                shippingTimeInDays: 1,
                latitude: '-8.047562',
                longitude: '-34.877016',
                postalCode: '50010-000',
                state: 'PE'
            },
            {
                storeID: '2',
                storeName: 'Loja São Paulo',
                type: 'LOJA',
                shippingTimeInDays: 2,
                latitude: '-23.550520',
                longitude: '-46.633308',
                postalCode: '01000-000',
                state: 'SP'
            }
        ];
    }
    getAllStores() {
        return {
            stores: this.stores,
            limit: this.stores.length,
            offset: 0,
            total: this.stores.length
        };
    }
    getStoreById(id) {
        const store = this.stores.find(s => s.storeID === id);
        if (!store) {
            return { error: 'Store not found' };
        }
        return store;
    }
    getStoresByState(state) {
        const filtered = this.stores.filter(s => s.state.toUpperCase() === state.toUpperCase());
        return {
            stores: filtered,
            limit: filtered.length,
            offset: 0,
            total: filtered.length
        };
    }
    async calcularFreteCorreios(origem, destino) {
        const args = {
            sCepOrigem: origem.replace('-', ''),
            sCepDestino: destino.replace('-', ''),
            nVlPeso: '1',
            nCdFormato: '1',
            nCdServico: ['04014', '04510'],
            nVlComprimento: '20',
            nVlAltura: '10',
            nVlLargura: '15',
            nVlDiametro: '0',
            sCdMaoPropria: 'N',
            nVlValorDeclarado: '0',
            sCdAvisoRecebimento: 'N',
        };
        try {
            const resultado = await (0, correios_brasil_1.calcularPrecoPrazo)(args);
            return resultado.map(item => ({
                description: item.Codigo === '04014' ? 'SEDEX' : 'PAC',
                codProdutoAgencia: item.Codigo,
                prazo: `${item.PrazoEntrega} dias úteis`,
                price: `R$ ${parseFloat(item.Valor.replace(',', '.')).toFixed(2).replace('.', ',')}`,
            }));
        }
        catch (error) {
            console.error('Erro ao calcular frete:', error);
            return [];
        }
    }
    async getStoresByCep(cep) {
        try {
            const viaCepUrl = `http://viacep.com.br/ws/${cep}/json`;
            const viaCepResponse = await axios_1.default.get(viaCepUrl);
            const addressData = viaCepResponse.data;
            if (addressData.erro) {
                return { error: 'CEP inválido' };
            }
            const userCoordinates = { lat: -8.050, lng: -34.880 };
            const calculatedStores = this.stores.map(store => {
                const storeCoordinates = {
                    lat: parseFloat(store.latitude),
                    lng: parseFloat(store.longitude)
                };
                const distance = this.calculateDistance(userCoordinates, storeCoordinates);
                if (store.type === 'PDV' && distance <= 50) {
                    return {
                        name: store.storeName,
                        city: addressData.localidade || store.state,
                        postalCode: store.postalCode,
                        type: 'PDV',
                        distance: `${distance.toFixed(1)} km`,
                        value: this.calcularFreteCorreios(store.postalCode, addressData.cep)
                    };
                }
                else {
                    return {
                        name: store.storeName,
                        city: addressData.localidade || store.state,
                        postalCode: store.postalCode,
                        type: 'LOJA',
                        distance: `${distance.toFixed(1)} km`,
                        value: this.calcularFreteCorreios(store.postalCode, addressData.cep)
                    };
                }
            });
            return {
                stores: calculatedStores,
                limit: calculatedStores.length,
                offset: 0,
                total: calculatedStores.length
            };
        }
        catch (error) {
            return { error: 'Erro ao consultar o CEP' };
        }
    }
    calculateDistance(coord1, coord2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLon = toRad(coord2.lng - coord1.lng);
        const lat1 = toRad(coord1.lat);
        const lat2 = toRad(coord2.lat);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
StoresService = __decorate([
    (0, common_1.Injectable)()
], StoresService);
exports.StoresService = StoresService;
//# sourceMappingURL=store.service.js.map