import {
  Box,
  Button,
  Input,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { ChangeEvent, useState } from "react";
import { ChunkUpload } from "./libs/chunkUpload/chunkUpload.lib";
const withMargin: SxProps = { margin: "1em" };
function App() {
  const [file, setFile]: [File | undefined, Function] = useState(undefined);
  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [errText, setErrText] = useState("");
  async function handleUpload() {
    if (!file) return;
    await ChunkUpload.sendChunks(file, 8192, setUploading, setProgress)
      .then(() => {
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        setUploading(false);
        setErrText(err.message);
        setOpen(true);
      });
  }

  function handleInputChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    setFile(file);
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Modal
        open={isOpen}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: "350px",
            height: "200px",
            backgroundColor: "white",
            padding: "35px",
            borderRadius: "35px",
          }}
        >
          <Typography id="modal-modal-title">Error occured:</Typography>
          <Typography id="modal-modal-title" sx={{ color: "red" }}>
            {errText}
          </Typography>
        </Box>
      </Modal>
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
        <Input
          sx={{ ...withMargin }}
          type="file"
          onChange={handleInputChange}
        ></Input>
        {isUploading ? (
          <LinearProgress
            sx={{ width: "250px" }}
            variant="determinate"
            value={progress}
          />
        ) : (
          <Button
            sx={{ ...withMargin }}
            variant="contained"
            onClick={handleUpload}
          >
            Upload
          </Button>
        )}
      </Box>
    </>
  );
}

export default App;
