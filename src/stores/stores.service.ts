import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Store } from './interfaces/store.interface';
dotenv.config();

@Injectable()
export class StoresService {
  private stores: Store[] = [
    { storeName: 'Loja Recife', postalCode: '50030230', latitude: -8.0568146, longitude: -34.8737217, state: 'PE' },
    { storeName: 'Loja Salvador', postalCode: '40015160', latitude: -12.9801943, longitude: -38.5285326, state: 'BA' },
    { storeName: 'Loja Petrolina', postalCode: '56302200', latitude: -9.3864618, longitude: -40.5044449, state: 'BA' },
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
      if (!location) throw new Error('Localização não encontrada');
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
      console.error('Token do Melhor Envio não definido');
      return [];
    }

    // Format CEPs (remove all non-numeric characters)
    const formatCep = (cep: string) => cep.replace(/\D/g, '');
    const cepOrigem = formatCep(origemCep);
    const cepDestino = formatCep(destinoCep);

    if (!cepOrigem || !cepDestino || cepOrigem.length !== 8 || cepDestino.length !== 8) {
      console.error('CEPs inválidos');
      return [];
    }

    try {
      const response = await axios.post(
        'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
        {
          from: { postal_code: cepOrigem },
          to: { postal_code: cepDestino },
          package: {
            weight: 1,
            width: 11,
            height: 17,
            length: 19,
          },
          options: {
            insurance_value: 100,
            receipt: false,
            own_hand: false,
            reverse: false,
            non_commercial: true,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((item: any) => ({
        description: item.name,
        prazo: `${item.delivery_time?.days || 'N/A'} dias úteis`,
        price: item.price ? `R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}` : 'Indisponível',
      }));
    } catch (error: any) {
      console.error('Erro ao calcular com Melhor Envio:', error.response?.data || error.message || error);
      return [];
    }
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

  async getTodasLojasComFrete(cep: string) {
    // Format input CEP
    const userCep = cep.replace(/\D/g, '');
    if (userCep.length !== 8) {
      return [];
    }

    const userCoords = await this.getCoordsFromCep(userCep);

    const resultados = await Promise.all(
      this.stores.map(async (store) => {
        const distancia = this.calculateDistance(userCoords, {
          lat: store.latitude,
          lng: store.longitude,
        });

        const frete = await this.getFrete(store.postalCode, userCep);

        return {
          loja: store.storeName,
          estado: store.state,
          cep: store.postalCode,
          distancia: `${distancia.toFixed(1)} km`,
          fretes: frete.length > 0 ? frete : [{ description: 'Nenhum frete disponível', prazo: 'N/A', price: 'N/A' }],
        };
      })
    );

    return resultados.sort((a, b) => {
      const aDist = parseFloat(a.distancia.replace(' km', ''));
      const bDist = parseFloat(b.distancia.replace(' km', ''));
      return aDist - bDist;
    });
  }
}