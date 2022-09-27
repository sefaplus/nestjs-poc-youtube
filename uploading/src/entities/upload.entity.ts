import { UploadStatus } from 'src/consts/upload-status.enum';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'upload_requests' })
export class UploadRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'text' })
  request_id: string;

  @Column({ type: 'int' })
  max_chunks: number;

  @Column({ type: 'int' })
  current_chunk: number;

  @Column({ type: 'text' })
  extension: string;

  @Column({ type: 'int' })
  filesize: number;

  @Column({ enum: UploadStatus, default: UploadStatus.PENDING })
  upload_status: UploadStatus;
}
