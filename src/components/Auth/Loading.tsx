import { Box, CircularProgress, Fade } from '@mui/material';

export default function Loading() {
  return (
    <Box
      height={'100vh'}
      alignItems={'center'}
      justifyContent={'center'}
      display={'flex'}
    >
      <Fade in>
        <CircularProgress size={'50px'} />
      </Fade>
    </Box>
  );
}
