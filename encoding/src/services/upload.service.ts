import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { initialDto } from 'src/dtos/upload.dto';
import { UploadRequest } from 'src/entities/upload.entity';
import { FileIdAnswer } from 'src/helpers/helpers';
import { Repository } from 'typeorm';
import * as fsPromises from 'fs/promises';
import { UploadStatus } from 'src/consts/upload-status.enum';

@Injectable()
export class UploadingService {
  constructor(
    @InjectRepository(UploadRequest)
    private readonly repositoryUpload: Repository<UploadRequest>,
  ) {}
  async initial(id: string, chunk: any, initialDto: initialDto) {
    try {
      const { extension, filesize, maxchunks } = initialDto;

      const found = await this.repositoryUpload.findOne({
        where: { request_id: id, upload_status: UploadStatus.PENDING },
      });

      if (found) return FileIdAnswer(found.id, found.current_chunk);

      const saved = await this.repositoryUpload.save({
        request_id: id,
        filesize,
        extension,
        max_chunks: maxchunks,
        current_chunk: 0,
      });

      await this.appendFile(saved.id, saved.extension, chunk.buffer);

      return FileIdAnswer(saved.id, saved.current_chunk + 1);
    } catch (err) {}
  }

  async upload(id: string, chunk: any, currentChunk: string) {
    try {
      const found = await this.repositoryUpload.findOne({ where: { id } });

      if (!found) throw new BadRequestException('Upload request not found.');

      const nextChunk = parseInt(currentChunk) + 1;

      await this.repositoryUpload.save({
        ...found,
        current_chunk: nextChunk,
      });

      if (found.max_chunks + 1 === nextChunk) {
        await this.repositoryUpload.save({
          ...found,
          upload_status: UploadStatus.COMPLETED,
        });
        return { finished: true };
      }
      await this.appendFile(found.id, found.extension, chunk.buffer);
      return FileIdAnswer(found.id, nextChunk);
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }

  async appendFile(id: string, extension: string, data: any) {
    await fsPromises.appendFile(
      __dirname + `/../uploads/${id}.${extension}`,
      data,
    );
  }
}
