import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { calcularPrecoPrazo } from 'correios-brasil';





@Injectable()
export class StoresService {
  // Dados simulados de lojas – em produção, esses dados geralmente vêm de um banco de dados.
  private stores = [
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

  getAllStores() {
    return {
      stores: this.stores,
      limit: this.stores.length,
      offset: 0,
      total: this.stores.length
    };
  }

  getStoreById(id: string) {
    const store = this.stores.find(s => s.storeID === id);
    if (!store) {
      return { error: 'Store not found' };
    }
    return store;
  }

  getStoresByState(state: string) {
    const filtered = this.stores.filter(s => s.state.toUpperCase() === state.toUpperCase());
    return {
      stores: filtered,
      limit: filtered.length,
      offset: 0,
      total: filtered.length
    };
  }
  async calcularFreteCorreios(origem: string, destino: string) {
    const args = {
      sCepOrigem: origem.replace('-', ''),
      sCepDestino: destino.replace('-', ''),
      nVlPeso: '1', // Peso em Kg
      nCdFormato: '1',
      nCdServico: ['04014', '04510'], // 04014 = SEDEX, 04510 = PAC
      nVlComprimento: '20',
      nVlAltura: '10',
      nVlLargura: '15',
      nVlDiametro: '0',
      sCdMaoPropria: 'N',
      nVlValorDeclarado: '0',
      sCdAvisoRecebimento: 'N',
    };
  
    try {
      const resultado = await calcularPrecoPrazo(args);
  
      return resultado.map(item => ({
        description: item.Codigo === '04014' ? 'SEDEX' : 'PAC',
        codProdutoAgencia: item.Codigo,
        prazo: `${item.PrazoEntrega} dias úteis`,
        price: `R$ ${parseFloat(item.Valor.replace(',', '.')).toFixed(2).replace('.', ',')}`,
      }));
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      return [];
    }
  }

  async getStoresByCep(cep: string) {
    try {
      // Consulta o ViaCEP para obter o endereço a partir do CEP
      const viaCepUrl = `http://viacep.com.br/ws/${cep}/json`;
      const viaCepResponse = await axios.get(viaCepUrl);
      const addressData = viaCepResponse.data;

      if (addressData.erro) {
        return { error: 'CEP inválido' };
      }

      // Em um cenário real, converta o endereço para coordenadas usando uma API de geocoding (ex: Google Maps)
      // Aqui, usamos coordenadas simuladas para o exemplo.
      const userCoordinates = { lat: -8.050, lng: -34.880 };

      // Para cada loja, calculamos a distância com base nas coordenadas
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
        } else {
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

    } catch (error) {
      return { error: 'Erro ao consultar o CEP' };
    }
  }

  // Cálculo de distância utilizando a fórmula de Haversine
  calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
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
}
