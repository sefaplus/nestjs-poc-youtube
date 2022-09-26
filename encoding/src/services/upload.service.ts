import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { initialDto } from 'src/dtos/upload.dto';
import { UploadEntity } from 'src/entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadingService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly repositoryUpload: Repository<UploadEntity>,
  ) {}
  initial(id: string, chunk: File, initialDto: initialDto) {
    try {
    } catch (err) {}
  }

  upload(id: string, chunk: File) {
    try {
      this.repositoryUpload.save({ request_id: id, currentIndex: 0 });
    } catch (err) {
      Logger.error(err);
    }
  }
}
