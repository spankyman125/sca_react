import { useTheme } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { memo, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { User } from '../../../api/http/interfaces';
import RoomInfoUI from '../../../stores/ui/App/RoomPanel/RoomBar/RoomUsersUI';
import { STATIC_URL } from '../../../consts';

export const RoomInfo = observer(({ store }: { store: RoomInfoUI }) => {
  const handleClick = useCallback(
    (userId: number) => void store.removeUser(userId),
    [store],
  );
  const itemContent = (_index: number, user: User) => {
    return <UserRow user={user} handleClick={handleClick} />;
  };
  const theme = useTheme();

  return (
    <Virtuoso
      style={{
        flexGrow: 1,
        backgroundColor: theme.palette.grey[900],
      }}
      computeItemKey={(_index, item) => item.id}
      data={store.users}
      totalCount={store.users.length}
      itemContent={itemContent}
      overscan={600}
    />
  );
});

const UserRow = memo(
  ({
    user,
    handleClick,
  }: {
    user: User;
    handleClick: (userId: number) => void;
  }) => {
    return (
      <ListItem
        component="div"
        disablePadding
        secondaryAction={
          <IconButton
            onClick={() => handleClick(user.id)}
            edge="end"
            sx={{ mr: 1 }}
          >
            <PersonRemoveIcon />
          </IconButton>
        }
      >
        <ListItemButton alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={user.pseudonym} src={STATIC_URL + user.avatarUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={user.pseudonym}
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
