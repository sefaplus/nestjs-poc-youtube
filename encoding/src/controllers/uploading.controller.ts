import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { uploadDto } from 'src/dtos/upload.dto';
import { UploadingService } from 'src/services/upload.service';

@Controller()
export class UploadingController {
  constructor(private readonly uploadingService: UploadingService) {}

  @Post('upload/:id')
  upload(@Param('id') id: string, @Body() data: uploadDto): string {
    return this.uploadingService.upload(id, data.chunk);
  }
}
