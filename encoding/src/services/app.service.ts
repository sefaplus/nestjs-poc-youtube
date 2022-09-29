import { Inject, Logger } from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import { Client } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { ServerConfig } from 'src/config/config';
import { ProcessedVideoStatus } from 'src/consts/status.enum';
import { VideoConsts } from 'src/consts/video.consts';
import { VideoData } from 'src/consts/video.data.type';
import { ProcessedVideo } from 'src/entitites/processed-videos.entity';
import { transcodeVid } from 'src/helpers/video.helper';
import { Repository } from 'typeorm';

export class AppService {
  constructor(
    @InjectRepository(ProcessedVideo)
    private readonly repositoryProccessedVideo: Repository<ProcessedVideo>,
    @Inject('ENCODED_QUEUE')
    private readonly Queue__encoded: ClientProxy,
    @Inject('STREAMING_QUEUE')
    private readonly Queue__streaming: ClientProxy,
    private readonly minIO: MinioService,
  ) {
    this.Queue__encoded.connect();
    this.Queue__streaming.connect();
  }
  async aaa() {
    let bb;
    // Oleg
    const obj = await this.minIO.client.getPartialObject(
      ServerConfig.MinIO.streaming_bucker,
      '1080p-beadba70-0491-4541-a827-bfb5ff52e87c.mp4',
      0,
      1024 * 1024,
    );

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        bb = obj.read();
        resolve();
      }, 2000);
    });
    return bb;
  }
  async encodeVideo(data: VideoData, context: RmqContext) {
    const { filesize, id, name } = data;
    try {
      const nameNoExtension = name.split('.').shift();

      // Download original video from the bucket
      await (this.minIO.client as Client).fGetObject(
        ServerConfig.MinIO.encoding_bucket,
        name,
        `${__dirname}/../temp/${name}`,
      );
      // Flags for the video formats that have been created.
      const flags = {
        '360p': false,
        '480p': false,
        '720p': false,
        '1080p': false,
      };

      const saved = await this.repositoryProccessedVideo.save({
        id,
        filename: `${nameNoExtension}.mp4`,
        filesize,
        ...flags,
      });

      await new ffmpeg(`${__dirname}/../temp/${name}`)
        // 360
        .then(async (video) => {
          await transcodeVid(
            video,
            nameNoExtension,
            360,
            VideoConsts.BITRATE_360,
          );

          flags['360p'] = true;

          return video;
        })
        // 480
        .then(async (video) => {
          await transcodeVid(
            video,
            nameNoExtension,
            480,
            VideoConsts.BITRATE_480,
          );

          flags['480p'] = true;

          return video;
        })
        // 720
        .then(async (video) => {
          await transcodeVid(
            video,
            nameNoExtension,
            720,
            VideoConsts.BITRATE_720,
          );

          flags['720p'] = true;

          return video;
        })
        // 1080
        .then(async (video) => {
          await transcodeVid(
            video,
            nameNoExtension,
            1080,
            VideoConsts.BITRATE_1080,
          );

          flags['1080p'] = true;

          return video;
        })
        .catch((err) => Logger.error(err));

      Object.keys(flags).map(async (key) => {
        const path = `${__dirname}/../encoded/${key}-${saved.filename}`;

        if (!fs.existsSync(path)) return;
        await (this.minIO.client as Client).fPutObject(
          ServerConfig.MinIO.streaming_bucker,
          `${key}-${saved.filename}`,
          path,
        );
        fs.unlinkSync(path);
      });

      const newSaved = await this.repositoryProccessedVideo.save({
        ...saved,
        ...flags,
        status: ProcessedVideoStatus.COMPLETED,
      });

      context.getChannelRef().ack(context.getMessage());
      this.Queue__streaming.emit('add-to-stream', { ...newSaved });
    } catch (err) {
      Logger.error(err);
      await this.repositoryProccessedVideo.save({
        id,
        status: ProcessedVideoStatus.COMPLETED,
      });
    }
  }
}
