import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { ServerConfig } from './config/config';
import { typeOrmModuleOptions } from './config/orm.config';
import { AppController } from './controllers/app.controller';
import { ProcessedVideo } from './entitites/processed-videos.entity';
import { createRMQQueueProvider } from './helpers/helpers';
import { AppService } from './services/app.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...typeOrmModuleOptions,
      }),
    }),
    TypeOrmModule.forFeature([ProcessedVideo]),
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 9099,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Take note we have a different queue for processed videos.
    // This is just to reduce size of the main upload queue..
    createRMQQueueProvider(
      'ENCODED_QUEUE',
      ServerConfig.RMQ.encoded_queue_name,
    ),
    createRMQQueueProvider(
      'STREAMING_QUEUE',
      ServerConfig.RMQ.streaming_queue_name,
    ),
  ],
})
export class AppModule {}
