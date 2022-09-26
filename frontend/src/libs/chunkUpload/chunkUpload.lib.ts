export class ChunkUpload {
  public static getChunk(file: File, index: number, chunkSize: number) {
    const offset = chunkSize * index;

    const blob = file.slice(offset - chunkSize, offset);

    return blob;
  }

  public static GenerateHashCode(s: string) {
    return s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  public static async sendChunks(file: File, chunkSize: number) {
    const firstChunk = await file.slice(0, chunkSize).text();

    const id = this.GenerateHashCode(firstChunk); // Temporary id
    console.log(id);

    if (!window.File || !window.FileReader)
      throw new Error("File and FileReader are not supported on this browser");
    // Throw on file not allowed type
    if (!(file instanceof File) || !(file instanceof Blob))
      throw new Error("File must be of type File | Blob");

    if (!file) throw new Error("File is empty");

    const numberOfChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < numberOfChunks; i++) {
      const buff = await this.getChunk(file, i, chunkSize);
      const response = await fetch('http://')
    }
  }
}
