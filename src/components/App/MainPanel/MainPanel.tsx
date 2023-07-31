import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import MainPanelUI from '../../../stores/ui/App/MainPanel/MainPanelUI';
import MainBar from './MainBar';
import MainRooms from './MainRooms';

export const MainPanel = observer(({ store }: { store: MainPanelUI }) => {
  return (
    <Stack height={'inherit'}>
      <MainBar store={store.mainBarUI} />
      <MainRooms store={store.roomListUI} />
    </Stack>
  );
});
