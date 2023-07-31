import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  styled,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
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
}));

const RoomInput = observer(({ store }: { store: RoomInputUI }) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        padding: '0px 10px 0px 10px',
        boxShadow: '10px 10px 10px 10px black',
      }}
    >
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
        value={store.messageContent}
        endAdornment={
          <InputAdornment position="end">
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

export default RoomInput;
