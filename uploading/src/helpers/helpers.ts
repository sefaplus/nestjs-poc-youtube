import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ServerConfig } from 'src/config/config';

export function FileIdAnswer(id: string, nextChunk: number) {
  return { id, nextChunk };
}

export function createRMQQueueProvider(
  providerName: string,
  queueName: string,
) {
  return {
    provide: providerName,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [ServerConfig.RMQ.rmq_url],
          queue: queueName,
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  };
}
