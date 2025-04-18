import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurando CORS para permitir requisições de qualquer origem
  app.enableCors({
    origin: true, // Permite todas as origens ou especifique as origens permitidas como um array ['http://exemplo.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type,Accept,Authorization,apollo-require-preflight',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
