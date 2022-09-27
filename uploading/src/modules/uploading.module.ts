import { Module } from '@nestjs/common';
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
  providers: [UploadingService],
})
export class UploadingModule {}
