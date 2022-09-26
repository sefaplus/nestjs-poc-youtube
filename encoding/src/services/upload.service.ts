import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadingService {
  upload(id: string, chunk: File, extension: string) {
    return { message: 'Hello World!' };
  }
}
