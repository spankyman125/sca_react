import CreateRoomIcon from '@mui/icons-material/MapsUgc';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  IconButton,
  InputBase,
  Toolbar,
  alpha,
  styled,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import { STATIC_URL } from '../../../consts';
import { authStore } from '../../../stores/AuthStore';
import MainBarUI from '../../../stores/ui/App/MainPanel/MainBarUI';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import { RoomCreateDialog } from './CreateRoomDialog';

const MainBar = memo(({ store }: { store: MainBarUI }) => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ bgcolor: 'background.default' }}>
        <ProfileButton
          handleClick={() => {
            void userInfoPanelUI.open(authStore.user!.id);
          }}
        />
        <SearchField
          handleChange={(e) => store.setSearchedText(e.target.value)}
        />
        <CreateRoomButton
          handleClick={() => store.roomCreateDialogUI.setOpen(true)}
        />
        <RoomCreateDialog store={store.roomCreateDialogUI} />
      </Toolbar>
    </AppBar>
  );
});

const CreateRoomButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <IconButton
      onClick={handleClick}
      size="large"
      edge="end"
      color="inherit"
      sx={{ ml: 1 }}
    >
      <CreateRoomIcon />
    </IconButton>
  );
};

const ProfileButton = observer(
  ({ handleClick }: { handleClick: () => void }) => {
    return (
      <IconButton
        onClick={handleClick}
        edge="start"
        color="inherit"
        sx={{ mr: 1 }}
      >
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={STATIC_URL + authStore.user!.avatarUrl}
        />
      </IconButton>
    );
  },
);

export const SearchField = ({
  handleChange,
}: {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <SearchInputBase
        fullWidth
        onChange={handleChange}
        placeholder="Search…"
      />
    </SearchWrapper>
  );
};

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

export default MainBar;
