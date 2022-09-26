import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'uploads' })
export class UploadEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  request_id: string;

  @Column({ type: 'int', nullable: false })
  currentIndex: number;
}
