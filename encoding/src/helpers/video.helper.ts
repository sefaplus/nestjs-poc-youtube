import { Logger } from '@nestjs/common';
import { Video, VideoMetadata } from 'src/consts/video.data.type';
import * as fs from 'fs';

/**
 * Transcodes the ffmpeg video object to set height and bitrate. Then saves it in the `encoded` folder.
 *
 * Videos are saved in `encoded` folder, with the name that matches this pattern: `${expectedHeight}p-${filename}.mp4`
 *
 * Example: `360p-fe543613-dbfe-4aad-a7f7-c3d38f4b98b5.mp4`
 *
 * @param {Video} video  - ffmpeg video object.
 * @param {string} filename - original filename without extension.
 * @param {number} expectedHeight - expected video height in pixels. Will scale the video and try to keep aspect ration.
 * @param {number} maxBitrate - maximum bitrate the video is allowed to have, if it is lower than specified, sets the original bitrate.
 * @returns returns original `Video` object.
 */
export async function transcodeVid(
  video: Video,
  filename: string,
  expectedHeight: number,
  maxBitrate: number,
) {
  const metadata = video.metadata as VideoMetadata;
  const bitrate = parseInt(metadata.video.bitrate, 10);
  const destination = `${__dirname}/../encoded/${expectedHeight}p-${filename}.mp4`;

  if (metadata.video.resolution.h < expectedHeight)
    throw new Error('Original video height is smaller than expected.');
  if (fs.existsSync(destination)) return video;

  Logger.log(`Started transcoding video. (${expectedHeight})`, 'Encoding');
  const setBitrate = bitrate > maxBitrate ? maxBitrate : bitrate;
  // Unfortunately for some unknown reason video.setVideoBitrate() is using
  // an older implementation of ffmpeg, and it adds command of -b={bitrate}kb
  // so we have to manually add the bitrate like so =>
  video.addCommand('-b:v', setBitrate + 'k');
  // Also it doesnt return video object so we do not put it in the chain below

  await video
    .setVideoSize(
      `?x${
        metadata.video.resolution.h > expectedHeight
          ? expectedHeight
          : metadata.video.resolution.h
      }`,
      true,
      true,
    )
    .setVideoCodec('h264')
    .setVideoFormat('mp4')
    .save(destination);

  return video;
}
