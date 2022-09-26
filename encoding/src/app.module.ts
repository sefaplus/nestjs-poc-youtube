import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadingController } from './controllers/uploading.controller';
import { UploadingService } from './services/upload.service';

@Module({
  imports: [],
  controllers: [AppController, UploadingController],
  providers: [AppService, UploadingService],
})
export class AppModule {}
