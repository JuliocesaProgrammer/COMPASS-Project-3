# 📦 Physical Store Backend - Sistema de Cálculo de Fretes

## 💡 Sobre o Projeto

Sistema backend para calcular fretes e encontrar lojas próximas a partir de um CEP informado. Desenvolvido em Node.js com TypeScript, oferece:

- 🏪 Busca automática das lojas mais próximas
- 📦 Cálculo preciso de fretes via API Melhor Envio
- 📍 Geolocalização via Google Maps API
- 🚀 Interface simples via linha de comando

## 🔧 Pré-requisitos

- Node.js v16+
- NPM ou Yarn
- Contas nas APIs:
  - [Melhor Envio](https://melhorenvio.com.br/)
  - [Google Maps](https://cloud.google.com/maps-platform/)

## 🚀 Começando

1. Instale as dependências:
```bash
npm install
```

2. Configure seu `.env`:
```env
GOOGLE_MAPS_API_KEY=sua_chave
MELHOR_ENVIO_TOKEN=seu_token
```

3. Execute:
```bash
npm run cep -- 01001000
```

## ✨ Funcionalidades

- Busca de endereço por CEP (ViaCEP)
- Cálculo de distância entre CEPs
- Cotação de fretes com múltiplas transportadoras
- Exibição organizada dos resultados

## 📝 Exemplo de Uso

```bash
Digite o CEP: 01001000

🔍 Lojas mais próximas:

🏬 Loja 1: Loja Salvador
📍 BA | 📦 40015160
📏 1453.0 km
🚚 Fretes:
   📦 Pac - R$ 45,90 (5 dias)
   📦 Sedex - R$ 67,30 (3 dias)
```

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou envie um PR.

## 📄 Licença

MIT © [Seu Nome]
