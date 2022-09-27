import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { ServerConfig } from 'src/config/config';
import { UploadingController } from 'src/controllers/uploading.controller';
import { UploadRequest } from 'src/entities/upload.entity';
import { createRMQQueueProvider } from 'src/helpers/helpers';
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
    createRMQQueueProvider('UPLOAD_QUEUE', ServerConfig.RMQ.uploads_queue_name),
  ],
})
export class UploadingModule {}
