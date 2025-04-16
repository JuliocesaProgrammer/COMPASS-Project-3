import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 ATIVANDO O CORS
  app.enableCors();

  await app.listen(3000);
  console.log('API rodando em http://localhost:3000');
}
bootstrap();
