export class initialDto {
  filesize: number;
  maxchunks: number;
  extension: string;
  chunkSize: number;
}

export class uploadDto {
  currentChunk: string;
}
