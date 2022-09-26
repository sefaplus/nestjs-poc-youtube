const server = 'http://localhost:3000';

export class ChunkUpload {
  /** Gets chunk from file */
  public static getChunk(file: File, index: number, chunkSize: number) {
    const offset = chunkSize * Math.max(index, 1);
    const start = offset - chunkSize;
    const blob = file.slice(Math.max(start, 0), offset);

    return blob;
  }
  /**
   * Generates hash code from string.
   * @param {string} s - string to generate hash code of
   * @returns {number} code
   */
  public static GenerateHashCode(s: string): number {
    return s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  /**
   * Uploads file to server.
   * @param file - File to upload
   * @param chunkSize - size of chunks to upload
   */
  public static async sendChunks(file: File, chunkSize: number) {
    if(!file) throw new Error('No file is supplied');;

    if (!window.File || !window.FileReader)
      throw new Error("File and FileReader are not supported on this browser");

    if (!(file instanceof File) || !(file instanceof Blob))
      throw new Error("File must be of type `File | Blob`");

    const firstChunk = file.slice(0, chunkSize);

    const id = this.GenerateHashCode(await firstChunk.text()); // Temporary id
    const extension = file.name.split('.').pop(); // File extension

    if(!extension) throw new Error('No file extension is found');

    const numberOfChunks = Math.ceil(file.size / chunkSize);

    const initialFormData = new FormData();

    initialFormData.append('chunk', firstChunk)
    initialFormData.append('filesize', file.size.toString());
    initialFormData.append('maxchunks', numberOfChunks.toString())
    initialFormData.append('extension',  extension);
    

    const initialResponse = await fetch(`${server}/initial/${id}`, {
      method: 'POST', mode: 'cors',
      body: initialFormData
    })
    
    return initialResponse.json()

    for (let i = 0; i < numberOfChunks; i++) {
      const blob = this.getChunk(file, i, chunkSize);

      const formData = new FormData();

      formData.append('chunk', blob)
      formData.append('currentIndex', i.toString())

      const response = await fetch(`${server}/upload/${id}`, {
        method: 'POST', mode: 'cors',
        body: formData
      })

      const responseJson = await response.json();

      if(responseJson.hasOwn('nextIndex')) {
        i = responseJson.nextIndex;
      }
    }
  }
}
