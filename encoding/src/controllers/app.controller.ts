import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { VideoData } from 'src/consts/video.data.type';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('to-encode')
  encodeHandler(@Ctx() context: RmqContext, @Payload() data: VideoData): void {
    this.appService.encodeVideo(data, context);
  }

  @Get('aaa')
  www() {
    return this.appService.aaa();
  }
}
