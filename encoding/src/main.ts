import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ServerConfig } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  // This only setups up connection to recieve the events for MessagePatterns

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [ServerConfig.RMQ.rmq_url],
      noAck: false,
      queue: ServerConfig.RMQ.uploads_queue_name,
      queueOptions: {
        durable: true,
      },
      // This controls how many messages service takes at once
      // 1 === Process one by one
      prefetchCount: 1,
    },
  });
  app.startAllMicroservices();

  await app.listen(ServerConfig.port, () =>
    Logger.log(`Encoding service started at ${ServerConfig.port}`),
  );
}
bootstrap();
