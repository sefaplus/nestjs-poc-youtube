import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'ENCODED_QUEUE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://guest:guest@localhost:5672`],
            queue: 'encoded',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class AppModule {}
