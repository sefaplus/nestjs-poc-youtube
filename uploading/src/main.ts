import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { ServerConfig, serverOptions } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, serverOptions);
  // This only setups up connection to recieve the events for MessagePatterns
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [ServerConfig.RMQ.rmq_url],
      noAck: false,
      queue: 'encoded',
      queueOptions: {
        durable: true,
      },
    },
  });

  if (!fs.existsSync(__dirname + '/uploads'))
    fs.mkdirSync(__dirname + '/uploads');

  app.startAllMicroservices();

  await app.listen(ServerConfig.port, () =>
    Logger.log(`Uploading service started at port ${ServerConfig.port}`),
  );
}
bootstrap();
