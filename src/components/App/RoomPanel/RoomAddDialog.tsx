import AddLinkIcon from '@mui/icons-material/AddLink';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Avatar,
  Box,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import RoomAddDialogUI, {
  ProposedUser,
} from '../../../stores/ui/App/RoomPanel/RoomAddDialogUI';
import { SearchField } from '../MainPanel/MainBar';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade mountOnEnter unmountOnExit ref={ref} {...props} />;
});

export const RoomAddDialog = observer(
  ({ store }: { store: RoomAddDialogUI }) => {
    const onePageLayout = useMediaQuery(useTheme().breakpoints.down('sm'));
    return (
      <Dialog
        fullWidth
        fullScreen={onePageLayout}
        open={store.open}
        // PaperProps={{ sx: { height: '100%' } }}
        TransitionComponent={Transition}
        onClose={() => store.setOpen(false)}
      >
        <DialogHeader store={store} />
        <DialogCenter store={store} />
        <DialogBottom store={store} />
      </Dialog>
    );
  },
);

const DialogHeader = observer(({ store }: { store: RoomAddDialogUI }) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void store.search(e.target.value, e.target.value);
    },
    [store],
  );
  return (
    <DialogTitle sx={{ display: 'flex' }}>
      <Stack flexGrow={1}>
        <Box display={'flex'}>
          <Box flexGrow={1}>Add users</Box>
          <IconButton>
            <AddLinkIcon />
          </IconButton>
        </Box>
        <SearchField handleChange={handleChange} />
      </Stack>
    </DialogTitle>
  );
});

const DialogCenter = observer(({ store }: { store: RoomAddDialogUI }) => {
  const handleClick = React.useCallback(
    (userId: number) => void store.addToRoom(userId),
    [store],
  );
  return (
    <DialogContent>
      <Typography paddingTop={1}>Friends:</Typography>
      <ProposedUsers users={store.proposedFriends} handleClick={handleClick} />
      <Typography paddingTop={1}>Others:</Typography>
      <ProposedUsers users={store.proposedOthers} handleClick={handleClick} />
    </DialogContent>
  );
});

const DialogBottom = observer(({ store }: { store: RoomAddDialogUI }) => {
  return (
    <DialogActions>
      <Button onClick={() => store.setOpen(false)}>Close</Button>
    </DialogActions>
  );
});

const ProposedUsers = React.memo(
  ({
    users,
    handleClick,
  }: {
    users: ProposedUser[];
    handleClick: (userId: number) => void;
  }) => {
    return (
      <List
        sx={{
          paddingBottom: 0,
        }}
      >
        {users.map((user) => {
          return (
            <ProposedUserItem
              key={user.id}
              user={user}
              handleClick={() => handleClick(user.id)}
            />
          );
        })}
      </List>
    );
  },
);

const ProposedUserItem = React.memo(
  ({ user, handleClick }: { user: ProposedUser; handleClick: () => void }) => {
    return (
      <ListItem
        component="div"
        disablePadding
        dense
        secondaryAction={
          <IconButton
            onClick={user.inRoom ? undefined : handleClick}
            edge="end"
            sx={{ mr: 1 }}
          >
            {user.inRoom ? <CheckIcon /> : <PersonAddIcon />}
          </IconButton>
        }
      >
        <ListItemButton alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={user.pseudonym} src={'/' + user.avatarUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.pseudonym} (${user.username})`}
            secondary={user.isOnline ? 'online' : 'offline'}
            secondaryTypographyProps={{
              color: user.isOnline ? 'cyan' : 'firebrick',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  },
);
