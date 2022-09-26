const server = "http://localhost:3000";
/**
 * Chunk upload lib.
 */
export class ChunkUpload {
  /** Gets chunk from file */
  public static getChunk(
    file: File,
    index: number,
    chunkSize: number,
    filesize: number
  ) {
    console.log(
      "minsize",
      Math.min(chunkSize * index, filesize),
      "index",
      index
    );
    const start = Math.min(chunkSize * index, filesize);
    const end = Math.min(start + chunkSize, filesize);

    const blob = file.slice(start, end);

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
  public static async sendChunks(
    file: File,
    chunkSize: number,
    setUploading: Function,
    setProgress: Function
  ) {
    if (!window.File || !window.FileReader)
      throw new Error("File and FileReader are not supported on this browser!");

    if (!file) throw new Error("No file is supplied");

    if (!(file instanceof File) || !(file instanceof Blob))
      throw new Error("File must be of type File | Blob!");

    // First initial chunk to send to server.
    const firstChunk = file.slice(0, chunkSize);
    // Writing filesize once to avoid loading file to memory more than once
    const filesize = file.size;
    // Generate temporary file id from first chunk
    const id = this.GenerateHashCode(await firstChunk.text());
    const extension = file.name.split(".").pop();

    if (!extension) throw new Error("No file extension is found!");

    setUploading(true); // Passed most checks, set uploading to true (React)

    const numberOfChunks = Math.ceil(filesize / chunkSize);

    // First, initial request to server. This will give us the id and index of our video to
    // resume the upload when the last one failed.
    const initialFormData = new FormData();
    initialFormData.append("chunk", firstChunk);
    initialFormData.append("filesize", filesize.toString());
    initialFormData.append("maxchunks", numberOfChunks.toString());
    initialFormData.append("extension", extension);

    const initialResponse = (await fetch(`${server}/initial/${id}`, {
      method: "POST",
      mode: "cors",
      body: initialFormData,
    }).then((data) => data.json())) as { id: string; nextChunk: number };

    setProgress((1 / numberOfChunks) * 100);

    let counter = initialResponse.nextChunk;

    while (counter <= numberOfChunks) {
      const blob = this.getChunk(file, counter, chunkSize, filesize);

      const formData = new FormData();
      formData.append("chunk", blob);
      formData.append("currentChunk", counter.toString());

      const response = await fetch(`${server}/upload/${initialResponse.id}`, {
        method: "POST",
        mode: "cors",
        body: formData,
      }).then((json) => json.json());

      // If server says we're finished. We're finished.
      if (response.hasOwnProperty("finished"))
        if (response.finished) return true;

      setProgress((counter / numberOfChunks) * 100);

      counter++;
    }

    setUploading(false);
  }
}
