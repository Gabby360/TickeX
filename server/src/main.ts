import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for Next.js frontend (Vercel & Local)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global API prefix (excluding root and health check)
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'],
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 TickeX API is running on: http://localhost:${port}/api`);
}
bootstrap();
