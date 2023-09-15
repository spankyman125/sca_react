import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { router } from 'main';
import { observer } from 'mobx-react-lite';
import { Room } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import MainRoomsUI from '../../../stores/ui/App/MainPanel/MainRoomsUI';

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
          highlighted={
            room.id === store.mainPanelUI.appUI.mediasoupStore.roomCallId
          }
        />
      ))}
    </List>
  );
});

const RoomListItem = observer(
  ({
    room,
    selected,
    highlighted,
  }: {
    room: Room;
    selected: boolean;
    highlighted: boolean;
  }) => {
    const theme = useTheme();
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
            primary={
              <Box display={'flex'} gap={1} alignItems={'center'}>
                {highlighted && (
                  <PhoneForwardedIcon sx={{ fontSize: 16 }} color="success" />
                )}
                <Typography
                  color={highlighted ? theme.palette.success.main : undefined}
                >
                  {room.name}
                </Typography>
              </Box>
            }
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
