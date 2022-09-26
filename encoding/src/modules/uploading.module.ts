import { Module } from '@nestjs/common';
import { UploadingController } from 'src/controllers/uploading.controller';
import { UploadingService } from 'src/services/upload.service';

@Module({
  imports: [],
  controllers: [UploadingController],
  providers: [UploadingService],
})
export class AppModule {}
