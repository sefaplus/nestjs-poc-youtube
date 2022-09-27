import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: any) {}

  getHello(): string {
    return this.appService.getHello();
  }
}
