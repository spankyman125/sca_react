import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import RoomBarUI from '../../../stores/ui/App/RoomPanel/RoomBarUI';
import { Theme } from '../App';
import { RoomAddDialog } from './RoomAddDialog';
import CallIcon from '@mui/icons-material/Call';
import Call from '@mui/icons-material/Call';

export const SecondaryBar = observer(({ store }: { store: RoomBarUI }) => {
  const onePageLayout = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  return (
    <AppBar position="static" sx={{ boxShadow: '0 8px 10px -10px black' }}>
      <Toolbar
        sx={{
          bgcolor: 'background.default',
          justifyContent: 'flex-end',
          gap: '20px  ',
        }}
      >
        {onePageLayout && <BackButton />}
        <Typography flexGrow={1}>{store.roomUI.room?.name}</Typography>
        <CallButton
          onClick={() => void store.roomUI.appUI.mediasoupStore.join()}
        />
        <IconButton
          color="inherit"
          onClick={() => store.roomUI.roomAddDialogUI.setOpen(true)}
        >
          <GroupAddIcon />
        </IconButton>
        <RoomAddDialog store={store.roomUI.roomAddDialogUI} />
        <UsersButton
          selected={store.roomUI.roomUsersUI.opened}
          onClick={() =>
            store.roomUI.roomUsersUI.setOpen(!store.roomUI.roomUsersUI.opened)
          }
        />
      </Toolbar>
    </AppBar>
  );
});

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <IconButton size="large" onClick={() => navigate('/app')}>
      <ArrowBackIcon />
    </IconButton>
  );
};

const UsersButton = ({
  onClick,
  selected,
}: {
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <IconButton onClick={onClick}>
      {selected ? <PeopleIcon /> : <GroupOutlinedIcon />}
    </IconButton>
  );
};

const CallButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton onClick={onClick}>
      <CallIcon />
    </IconButton>
  );
};
