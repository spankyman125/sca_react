import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Stack,
  styled,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { createRef } from 'react';
import RoomInputUI from '../../../stores/ui/App/RoomPanel/RoomInputUI';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[800],
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  bottom: '20px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 2),
  },
  zIndex: 1,
}));

const AttachmentList = observer(({ store }: { store: RoomInputUI }) => {
  const scrolledContainer = createRef<HTMLDivElement>();

  const scrollLeft = () => {
    if (scrolledContainer.current) scrolledContainer.current.scrollLeft -= 300;
  };

  const scrollRight = () => {
    if (scrolledContainer.current) scrolledContainer.current.scrollLeft += 300;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={scrollLeft}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '30%',
          '@media(any-pointer:coarse)': { display: 'none' },
        }}
      >
        <ArrowLeftOutlinedIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={scrollRight}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '30%',
          right: '0%',
          '@media(any-pointer:coarse)': { display: 'none' },
        }}
      >
        <ArrowRightOutlinedIcon fontSize="large" />
      </IconButton>
      <Stack
        ref={scrolledContainer}
        spacing={2}
        direction="row"
        sx={{
          marginBottom: '25px',
          marginTop: '5px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {store.attachmentsUrls.map((url, i) => (
          <AttachmentPreview
            attachmentImage={url}
            handleRemoveClick={() => {
              store.removeAttachment(i);
            }}
          />
        ))}
      </Stack>
    </Box>
  );
});

const AttachmentPreview = ({
  attachmentImage,
  handleRemoveClick,
}: {
  attachmentImage: string;
  handleRemoveClick: () => void;
}) => {
  return (
    <Box position={'relative'}>
      <IconButton
        sx={{ position: 'absolute', right: 0 }}
        onClick={handleRemoveClick}
      >
        <HighlightOffIcon />
      </IconButton>
      <img src={attachmentImage} height={100} />
    </Box>
  );
};

const RoomInput = observer(({ store }: { store: RoomInputUI }) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        padding: '0px 10px 0px 10px',
        boxShadow: '10px 10px 10px 10px black',
        minHeight: '50px',
      }}
    >
      {store.attachmentsUrls.length > 0 && <AttachmentList store={store} />}
      <StyledInputBase
        multiline
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          store.setMessage(e.target.value);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.code === 'Enter') {
            if (!e.shiftKey) {
              store.sendMessage();
              e.preventDefault();
            }
          }
        }}
        value={store.text}
        endAdornment={
          <InputAdornment position="end">
            <AttachmentButton
              onChange={(e) => store.setMessageAttachments(e.target.files)}
            />
            <IconButton
              onClick={() => {
                store.sendMessage();
              }}
              onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
              }}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        maxRows={5}
        placeholder="Input message..."
      />
    </Box>
  );
});

const AttachmentButton = ({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <IconButton component="label">
      <AddPhotoAlternateIcon />
      <input type="file" accept="image/*" onChange={onChange} hidden multiple />
    </IconButton>
  );
};
export default RoomInput;
