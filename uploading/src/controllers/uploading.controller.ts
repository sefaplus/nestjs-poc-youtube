import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { initialDto, uploadDto } from 'src/dtos/upload.dto';
import { UploadingService } from 'src/services/upload.service';

@Controller()
export class UploadingController {
  constructor(private readonly uploadingService: UploadingService) {}

  @UseInterceptors(FileInterceptor('chunk'))
  @Post('initial/:id')
  intiialUpload(
    @Param('id') id: string,
    @UploadedFile() chunk,
    @Body() initialDto: initialDto,
  ) {
    return this.uploadingService.initial(id, chunk, initialDto);
  }

  @UseInterceptors(FileInterceptor('chunk'))
  @Post('upload/:id')
  upload(
    @Param('id') id: string,
    @UploadedFile() chunk,
    @Body() body: uploadDto,
  ) {
    console.log(id, chunk, body);
    return this.uploadingService.upload(id, chunk, body.currentChunk);
  }
}
