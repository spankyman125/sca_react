import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { router } from 'main';
import { observer } from 'mobx-react-lite';
import { Room } from '../../../api/http/interfaces';
import MainRoomsUI from '../../../stores/ui/App/MainPanel/MainRoomsUI';
import { STATIC_URL } from '../../../consts';

const MainRooms = observer(({ store }: { store: MainRoomsUI }) => {
  return (
    <List
      sx={{
        overflow: 'auto',
      }}
    >
      {[...store.rooms].map(([, room]) => (
        <RoomListItem
          key={room.id}
          room={room}
          selected={room.id === store.activeRoomId}
        />
      ))}
    </List>
  );
});

const RoomListItem = observer(
  ({ room, selected }: { room: Room; selected: boolean }) => {
    return (
      <ListItem disablePadding key={room.id}>
        <ListItemButton
          alignItems="flex-start"
          selected={selected}
          onClick={() => void router.navigate(`/app/rooms/${room.id}`)}
        >
          <ListItemAvatar>
            <Avatar alt={room.name} src={STATIC_URL + room.avatarUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={room.name}
            secondary={
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                <b>{room.messages?.[0]?.user?.pseudonym}: </b>
                {room.messages?.[0]?.content}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  },
);
export default MainRooms;
