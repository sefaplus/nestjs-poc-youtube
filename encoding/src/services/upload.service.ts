import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadingService {
  upload(id: string, chunk: Buffer): string {
    return 'Hello World!';
  }
}
