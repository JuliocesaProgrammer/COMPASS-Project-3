import { StoresService } from './stores/stores.service';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Digite o CEP: ', async (cep) => {
  const storesService = new StoresService();

  try {
    const lojas = await storesService.getTodasLojasComFrete(cep);

    if (lojas.length === 0) {
      console.log('❌ Nenhuma loja encontrada.');
    } else {
      console.log('\n🔍 Lojas mais próximas:\n');

      lojas.forEach((loja, index) => {
        console.log(`🏬 Loja ${index + 1}: ${loja.loja.storeName}`);
        console.log(`📍 Estado: ${loja.loja.state}`);
        console.log(`📦 CEP: ${loja.loja.postalCode}`);
        console.log(`📏 Distância: ${loja.distancia}`);
        console.log('🚚 Fretes disponíveis:');

        if (loja.frete.length === 0) {
          console.log('   ❌ Nenhum frete disponível.');
        } else {
          loja.frete.forEach((f: any) => {
            console.log(`   📦 ${f.description} - ${f.price} (${f.prazo})`);
          });
        }

        console.log('\n──────────────────────────────\n');
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao processar o CEP:', error.message);
    } else {
      console.error('Erro ao processar o CEP:', error);
    }
  } finally {
    rl.close();
  }
});
