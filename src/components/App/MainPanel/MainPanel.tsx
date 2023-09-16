import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import MainPanelUI from '../../../stores/ui/App/MainPanel/MainPanelUI';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import MainBar from './MainBar';
import MainRooms from './MainRooms';
import { UserInfoPanel } from './UserInfoPanel';

export const MainPanel = observer(({ store }: { store: MainPanelUI }) => {
  return (
    <Stack height={'inherit'}>
      <MainBar store={store.mainBarUI} />
      <MainRooms store={store.roomListUI} />
      <UserInfoPanel store={userInfoPanelUI} />
    </Stack>
  );
});
