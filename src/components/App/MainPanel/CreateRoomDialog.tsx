import { DialogContent, Fade, TextField } from '@mui/material';
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
          <TextField
            onChange={(e) => store.setName(e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="Room name"
            fullWidth
            variant="standard"
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
