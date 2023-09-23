import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  List,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import { User } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import { authStore } from '../../../stores/AuthStore';
import {
  UserInfoPanelUI,
  userInfoPanelUI,
} from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import { RemoveUserRow, UserRow } from '../SecondaryPanel/RoomInfo';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade mountOnEnter unmountOnExit ref={ref} {...props} />;
});

export const UserInfoPanel = observer(
  ({ store }: { store: UserInfoPanelUI }) => {
    const onePageLayout = useMediaQuery(useTheme().breakpoints.down('sm'));
    return (
      <Dialog
        fullWidth
        fullScreen={onePageLayout}
        open={store.isOpened}
        TransitionComponent={Transition}
        onClose={() => store.close()}
      >
        <UserPanelHeader />
        <UserPanelCenter store={store} />
        <UserPanelBottom store={store} />
      </Dialog>
    );
  },
);

const UserPanelHeader = observer(() => {
  return <DialogTitle>User info</DialogTitle>;
});

const UserPanelCenter = observer(({ store }: { store: UserInfoPanelUI }) => {
  return (
    <DialogContent>
      <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        <Box>
          <Avatar
            src={store.user?.avatarUrl && STATIC_URL + store.user?.avatarUrl}
            alt={store.user?.username}
            sx={{ height: 120, width: 120 }}
          ></Avatar>
        </Box>
        <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
          <Typography>
            <b>Username: </b>
            {store.user?.username}
          </Typography>
          <Typography>
            <b>Pseudonym: </b>
            {store.user?.pseudonym}
          </Typography>
          <Typography>
            <b>Status: </b>
            {store.user?.isOnline ? 'online' : 'offline'}
          </Typography>
          {!store.isSelfUser && (
            <Box display={'flex'} flexGrow={1}>
              {authStore.user?.friends.find(
                (friend) => friend.id === store.user?.id,
              ) ? (
                <Button
                  sx={{ alignSelf: 'end' }}
                  variant="outlined"
                  onClick={() => void authStore.removeFriend(store.user!.id)}
                >
                  Remove friend
                </Button>
              ) : (
                <Button
                  sx={{ alignSelf: 'end' }}
                  variant="outlined"
                  onClick={() => void authStore.addFriend(store.user!.id)}
                >
                  Add friend
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <br />
      <Box>Friends:</Box>
      <FriendsList
        canRemove={store.isSelfUser}
        users={store.friends ? store.friends : []}
      />
    </DialogContent>
  );
});

const UserPanelBottom = observer(({ store }: { store: UserInfoPanelUI }) => {
  return (
    <DialogActions>
      <Button onClick={() => store.close()}>Close</Button>
    </DialogActions>
  );
});

const FriendsList = observer(
  ({ users, canRemove }: { users: User[]; canRemove: boolean }) => {
    const handleRowClick = useCallback(
      (userId: number) => void userInfoPanelUI.open(userId),
      [],
    );
    const handleSecondaryClick = useCallback(
      (userId: number) => void authStore.removeFriend(userId),
      [],
    );
    return (
      <List>
        {users.map((user) => {
          return canRemove ? (
            <RemoveUserRow
              user={user}
              handleRowClick={handleRowClick}
              handleSecondaryClick={handleSecondaryClick}
            />
          ) : (
            <UserRow user={user} handleRowClick={handleRowClick} />
          );
        })}
      </List>
    );
  },
);
