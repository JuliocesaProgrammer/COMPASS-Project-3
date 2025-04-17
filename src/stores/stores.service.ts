import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Store } from './interfaces/store.interface';
dotenv.config();

@Injectable()
export class StoresService {
  private stores: Store[] = [
    { storeName: 'Loja Recife', postalCode: '50030-230', latitude: -8.0568146, longitude: -34.8737217, state: 'PE' },
    { storeName: 'Loja Salvador', postalCode: '40015-160', latitude: -12.9801943, longitude: -38.5285326, state: 'BA' },
    { storeName: 'Loja Petrolina', postalCode: '56302-200', latitude: -9.3864618, longitude: -40.5044449, state: 'PE' },
    { storeName: 'Loja Juazeiro', postalCode: '48903-410', latitude: -9.42011, longitude: -40.5166399, state: 'BA' },
  ];

  async getAddressByCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar endereço por CEP:', error.message || error);
      return {};
    }
  }

  async getCoordsFromCep(cep: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      );
      const location = response.data.results[0]?.geometry.location;
      return { lat: location.lat, lng: location.lng };
    } catch (error: any) {
      console.error('Erro ao obter coordenadas:', error.message || error);
      return { lat: 0, lng: 0 };
    }
  }

  getAllStores(): Store[] {
    return this.stores;
  }

  async getFrete(origemCep: string, destinoCep: string) {
    const token = process.env.MELHOR_ENVIO_TOKEN;
  
    if (!token) {
      console.error('❌ Token do Melhor Envio não definido no .env');
      return [];
    }
  
    const payload = [
      {
        from: { postal_code: origemCep.replace('-', '') },
        to: { postal_code: destinoCep.replace('-', '') },
        package: {
          weight: 1,
          width: 15,
          height: 10,
          length: 20,
        },
        services: ['1', '2'], // SEDEX e PAC no sandbox
      },
    ];
  
    try {
      const response = await axios.post(
        'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
  
      console.log('🛫 Resposta do Melhor Envio:', response.data);
  
      return response.data.map((item: any) => ({
        description: item.name,
        prazo: `${item.delivery_time.days} dias úteis`,
        price: `R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`,
      }));
    } catch (error: any) {
      console.error('❌ Erro ao calcular com Melhor Envio:', error.response?.data || error.message || error);
      return [];
    }
  }
  

  findClosestStore(lat: number, lng: number): Store | null {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    let minDistance = Number.MAX_VALUE;
    let closest: Store | null = null;

    for (const store of this.stores) {
      const dLat = toRad(store.latitude - lat);
      const dLon = toRad(store.longitude - lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) * Math.cos(toRad(store.latitude)) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance < minDistance) {
        minDistance = distance;
        closest = store;
      }
    }
    return closest;
  }

  calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getLojaMaisProximaComFrete(cep: string) {
    const coords = await this.getCoordsFromCep(cep);
    const loja = this.findClosestStore(coords.lat, coords.lng);

    if (!loja) return null;

    const frete = await this.getFrete(loja.postalCode, cep);
    const distancia = this.calculateDistance(coords, {
      lat: loja.latitude,
      lng: loja.longitude,
    });

    return {
      loja,
      distancia: `${distancia.toFixed(1)} km`,
      frete,
    };
  }
}
