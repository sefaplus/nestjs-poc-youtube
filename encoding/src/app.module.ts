import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmModuleOptions } from './config/orm.config';
import { UploadingController } from './controllers/uploading.controller';
import { UploadingService } from './services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...typeOrmModuleOptions,
      }),
    }),
  ],
  controllers: [AppController, UploadingController],
  providers: [AppService, UploadingService],
})
export class AppModule {}
