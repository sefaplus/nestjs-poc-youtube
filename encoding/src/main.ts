import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
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
      // This controls how many messages service takes at once
      // 1 === Process one by one
      prefetchCount: 1,
    },
  });
  app.startAllMicroservices();

  await app.listen(3005);
}
bootstrap();
