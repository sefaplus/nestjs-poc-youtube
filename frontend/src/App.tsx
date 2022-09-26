import { Box, Button, Input, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { ChangeEvent, useState } from "react";
import { ChunkUpload } from "./libs/chunkUpload/chunkUpload.lib";
const withMargin: SxProps = { margin: "1em" };
function App() {
  const [file, setFile]: [File | undefined, Function] =  useState(undefined)

  function handleUpload() {
    if(!file) return;
    ChunkUpload.sendChunks(file, 8192)
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const input = (event.target as HTMLInputElement);
    if(!input.files) return;
    const file = input.files[0];
    setFile(file);
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography sx={{ ...withMargin }}>Please upload file:</Typography>
        <Input sx={{ ...withMargin }} type="file" onChange={handleInputChange}></Input>
        <Button sx={{ ...withMargin }} variant="contained" onClick={handleUpload}>
          Upload
        </Button>
      </Box>
    </>
  );
}

export default App;
