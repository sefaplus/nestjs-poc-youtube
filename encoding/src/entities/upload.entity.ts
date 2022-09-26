import { UploadStatus } from 'src/consts/upload-status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'uploads' })
export class UploadEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  request_id: string;

  @Column({ type: 'int', nullable: false })
  currentIndex: number;

  @Column({ type: 'text', nullable: false })
  extension: string;

  @Column({ enum: UploadStatus, nullable: false })
  upload_status: UploadStatus;
}
