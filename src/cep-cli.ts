import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StoresService } from './stores/stores.service';
import * as readline from 'readline';

async function askCep(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question('Digite o CEP: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const storesService = app.get(StoresService);

  const cep = await askCep();
  const coords = await storesService.getCoordsFromCep(cep);
  const closest = storesService.findClosestStore(coords.lat, coords.lng);

  console.log('\n🔍 Loja mais próxima:');
  if (closest) {
    console.log(`🏬 Nome: ${closest.storeName}`);
    console.log(`📍 Estado: ${closest.state}`);
    console.log(`📦 CEP: ${closest.postalCode}`);
  } else {
    console.log('Nenhuma loja encontrada.');
  }

  await app.close();
}
bootstrap();
