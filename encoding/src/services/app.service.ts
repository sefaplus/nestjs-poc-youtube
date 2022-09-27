import { InjectRepository } from '@nestjs/typeorm';
import { ProcessedVideo } from 'src/entitites/processed-videos.entity';
import { Repository } from 'typeorm';

export class AppService {
  constructor(
    @InjectRepository(ProcessedVideo)
    private readonly repositoryProccessedVideo: Repository<ProcessedVideo>,
  ) {}
}
