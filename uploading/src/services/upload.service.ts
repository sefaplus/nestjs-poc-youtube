import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as fsPromises from 'fs/promises';
import { MinioService } from 'nestjs-minio-client';
import { UploadStatus } from 'src/consts/upload-status.enum';
import { initialDto } from 'src/dtos/upload.dto';
import { UploadRequest } from 'src/entities/upload.entity';
import { FileIdAnswer } from 'src/helpers/helpers';
import { Repository } from 'typeorm';

@Injectable()
export class UploadingService {
  constructor(
    private readonly minIO: MinioService,
    @InjectRepository(UploadRequest)
    private readonly repositoryUpload: Repository<UploadRequest>,
    @Inject('UPLOAD_QUEUE')
    private readonly Queue__uploads: ClientProxy,
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
      const name = `${found.id}.${found.extension}`;

      await this.repositoryUpload.save({
        ...found,
        current_chunk: nextChunk,
      });

      if (found.max_chunks + 1 === nextChunk) {
        const saved = await this.repositoryUpload.save({
          ...found,
          upload_status: UploadStatus.COMPLETED,
        });

        // I would love to use chunk upload on minio directly but i have no clue how
        // Documentation is terrible and theres not native way to do this as far
        // as I am aware...
        await this.minIO.client
          .fPutObject('youtube', name, `${__dirname}/../uploads/${name}`)
          .then(() => Logger.log(`${name} is uploaded to minIO`));
        // emit that we want this video processed. For now we dump the whole entity
        // May change in the future..
        this.Queue__uploads.emit('to-encode', { ...saved });

        return { finished: true };
      }
      await this.appendFile(found.id, found.extension, chunk.buffer);
      return FileIdAnswer(found.id, nextChunk);
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }
  // For testing purposes
  async encode(ctx: RmqContext, data: any) {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();
    console.log(data);
    channel.ack(msg);
  }

  async appendFile(id: string, extension: string, data: any) {
    await fsPromises.appendFile(
      __dirname + `/../uploads/${id}.${extension}`,
      data,
    );
  }
}
