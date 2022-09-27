import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { UploadingController } from 'src/controllers/uploading.controller';
import { UploadRequest } from 'src/entities/upload.entity';
import { UploadingService } from 'src/services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadRequest]),
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 9099,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    }),
  ],
  controllers: [UploadingController],
  providers: [
    UploadingService,
    {
      provide: 'UPLOAD_QUEUE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://guest:guest@localhost:5672`],
            queue: 'uploads',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
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
export class UploadingModule {}
