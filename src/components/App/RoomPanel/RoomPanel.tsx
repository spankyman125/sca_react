import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import useMediaQuery from '@mui/material/useMediaQuery';
import { observer } from 'mobx-react-lite';
import RoomPanelUI from '../../../stores/ui/App/RoomPanel/RoomPanelUI';
import { OnePageLayout, Theme, TwoPageLayout } from '../App';
import { RoomBar } from './RoomBar';
import RoomInput from './RoomInput';
import RoomMessages from './RoomMessages';
import { RoomUsers } from './RoomUsers';

export const RoomPanel = observer(({ store }: { store: RoomPanelUI }) => {
  const onePageLayout = useMediaQuery((theme) =>
    (theme as Theme).breakpoints.down('sm'),
  );
  if (onePageLayout)
    return (
      <OnePageLayout opened={store.appUI.activeRoomId !== undefined}>
        <RoomPanelContent store={store} />
      </OnePageLayout>
    );
  else
    return (
      <TwoPageLayout opened={store.appUI.activeRoomId !== undefined}>
        <RoomPanelContent store={store} />
      </TwoPageLayout>
    );
});

const RoomPanelContent = observer(({ store }: { store: RoomPanelUI }) => {
  const onePageLayout = useMediaQuery((theme) =>
    (theme as Theme).breakpoints.down('sm'),
  );
  if (store.appUI.activeRoomId) store.ensureRoomUI(store.appUI.activeRoomId);
  return store.roomsUI.map((roomUI) => (
    <Stack
      height={'100%'}
      display={store.appUI.activeRoomId === roomUI.roomId ? 'flex' : 'none'}
    >
      <RoomBar store={roomUI.roomBarUI} />
      <Grid container flexGrow={1}>
        <Grid
          display={roomUI.roomUsersUI.opened && onePageLayout ? 'none' : 'flex'}
          xs={roomUI.roomUsersUI.opened ? 0 : 12}
          md={roomUI.roomUsersUI.opened ? 9 : 12}
          flexDirection={'column'}
        >
          <RoomMessages store={roomUI.roomMessagesUI} />
          <RoomInput store={roomUI.roomInputUI} />
        </Grid>
        <Grid
          xs={roomUI.roomUsersUI.opened ? 12 : 0}
          md={roomUI.roomUsersUI.opened ? 3 : 0}
        >
          <RoomUsers store={roomUI.roomUsersUI} />
        </Grid>
      </Grid>
    </Stack>
  ));
});
