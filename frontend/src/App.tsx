import { Box, Button, Input, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
const withMargin: SxProps = { margin: "1em" };
function App() {
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
        <Input sx={{ ...withMargin }} type="file"></Input>
        <Button sx={{ ...withMargin }} variant="contained">
          Upload
        </Button>
      </Box>
    </>
  );
}

export default App;
