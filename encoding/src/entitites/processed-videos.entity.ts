import { ProcessedVideoStatus } from 'src/consts/status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proccessed_videos' })
export class ProcessedVideo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  filename: string;

  @Column({ type: 'int' })
  filesize: number;

  @Column({ type: 'bool', default: false })
  '1080p': boolean;

  @Column({ type: 'bool', default: false })
  '720p': boolean;

  @Column({ type: 'bool', default: false })
  '480p': boolean;

  @Column({ type: 'bool', default: false })
  '360p': boolean;

  @Column({
    enum: ProcessedVideoStatus,
    default: ProcessedVideoStatus.PROCESSING,
  })
  status: ProcessedVideoStatus;
}
