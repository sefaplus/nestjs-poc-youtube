import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  // This only setups up connection to recieve the events for MessagePatterns
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      noAck: false,
      queue: 'uploads',
      queueOptions: {
        durable: true,
      },
    },
  });

  if (!fs.existsSync(__dirname + '/uploads'))
    fs.mkdirSync(__dirname + '/uploads');

  app.startAllMicroservices();

  await app.listen(3000, () =>
    Logger.log('Uploading service started at port 3000'),
  );
}
bootstrap();
