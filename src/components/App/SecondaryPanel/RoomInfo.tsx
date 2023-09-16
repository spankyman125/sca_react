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
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';

export const RoomInfo = observer(({ store }: { store: RoomInfoUI }) => {
  const handleRowClick = useCallback(
    (userId: number) => void userInfoPanelUI.open(userId),
    [],
  );
  const handleSecondaryClick = useCallback(
    (userId: number) => void store.removeUser(userId),
    [store],
  );
  const itemContent = (_index: number, user: User) => {
    return (
      <RemoveUserRow
        user={user}
        handleSecondaryClick={handleSecondaryClick}
        handleRowClick={handleRowClick}
      />
    );
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

export const RemoveUserRow = memo(
  ({
    user,
    handleRowClick,
    handleSecondaryClick,
  }: {
    user: User;
    handleRowClick?: (userId: number) => void;
    handleSecondaryClick?: (userId: number) => void;
  }) => {
    return (
      <UserRow
        user={user}
        handleRowClick={handleRowClick}
        secondaryAction={
          <IconButton
            onClick={
              handleSecondaryClick && (() => handleSecondaryClick(user.id))
            }
            edge="end"
            sx={{ mr: 1 }}
          >
            <PersonRemoveIcon />
          </IconButton>
        }
      />
    );
  },
);

export const UserRow = memo(
  ({
    user,
    handleRowClick,
    secondaryAction,
  }: {
    user: User;
    handleRowClick?: (userId: number) => void;
    secondaryAction?: React.ReactNode;
  }) => {
    return (
      <ListItem
        component="div"
        disablePadding
        secondaryAction={secondaryAction}
      >
        <ListItemButton
          alignItems="flex-start"
          onClick={handleRowClick && (() => handleRowClick(user.id))}
        >
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
