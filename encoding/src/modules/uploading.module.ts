import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadingController } from 'src/controllers/uploading.controller';
import { UploadRequest } from 'src/entities/upload.entity';
import { UploadingService } from 'src/services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadRequest])],
  controllers: [UploadingController],
  providers: [UploadingService],
})
export class UploadingModule {}
