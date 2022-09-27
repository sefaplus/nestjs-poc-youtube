import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  if (!fs.existsSync(__dirname + '/uploads'))
    fs.mkdirSync(__dirname + '/uploads');
  await app.listen(3000);
  Logger.log('Encoding services started at port 3000');
}
bootstrap();
