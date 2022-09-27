import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('ENCODED_QUEUE')
    private readonly Queue__encoded: ClientProxy,
  ) {}
  @MessagePattern('to-encode')
  encodeHandler(@Ctx() context: RmqContext, @Payload() data) {
    console.log('IM GONNA ENCODE!', data);
    this.Queue__encoded.emit('encoded', { ...data });
  }
}
