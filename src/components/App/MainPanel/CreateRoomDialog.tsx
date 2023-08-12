import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Box,
  DialogContent as MuiDialogContent,
  Fade,
  TextField,
  styled,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import RoomCreateDialogUI from '../../../stores/ui/App/MainPanel/RoomCreateDialogUI';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const RoomImage = styled('img')(({ theme }) => ({
  height: '120px',
  width: '120px',
  borderRadius: '60px',
  bgcolor: 'grey.800',
}));

const FileUploadButton = ({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Button
      component="label"
      variant="contained"
      sx={{
        height: '35px',
        width: '35px',
        minWidth: '0px',
        position: 'absolute',
        right: 0,
        bottom: 15,
      }}
    >
      <FileUploadIcon />
      <input type="file" accept="image/*" onChange={onChange} hidden />
    </Button>
  );
};

export const RoomCreateDialog = observer(
  ({ store }: { store: RoomCreateDialogUI }) => {
    return (
      <Dialog
        fullWidth
        open={store.open}
        TransitionComponent={Transition}
        onClose={() => store.setOpen(false)}
      >
        <DialogTitle>Create new room</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <FileUploadButton
              onChange={(e) => store.setImage(e.target.files?.[0])}
            />
            <RoomImage src={store.imageURL} />
          </Box>
          <TextField
            sx={{ alignSelf: 'center', flexGrow: 1 }}
            onChange={(e) => store.setName(e.target.value)}
            autoFocus
            id="name"
            label="Room name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => void store.createRoom()}>Create</Button>
          <Button onClick={() => store.setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  },
);
