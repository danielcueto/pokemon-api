import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);

  const config = new DocumentBuilder()
    .setTitle('Pokemon API')
    .setDescription('Una api de pokemones para aprender sobre nestjs')
    .setVersion('1.0')
    //.addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  //grpc config
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'types',
      protoPath: join(__dirname, './types-grpc/types.proto'),
      url: '0.0.0.0:3001',
    },
  });

  microservice.useGlobalPipes(validationPipe);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
