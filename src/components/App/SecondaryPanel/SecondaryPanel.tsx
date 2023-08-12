import { Stack, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import useMediaQuery from '@mui/material/useMediaQuery';
import { observer } from 'mobx-react-lite';
import SecondaryPanelUI from '../../../stores/ui/App/RoomPanel/RoomPanelUI';
import { OnePageLayout, Theme, TwoPageLayout } from '../App';
import { SecondaryBar } from './RoomBar';
import RoomInput from './RoomInput';
import RoomMessages from './RoomMessages';
import { RoomInfo } from './RoomInfo';

export const SecondaryPanel = observer(
  ({ store }: { store: SecondaryPanelUI }) => {
    const onePageLayout = useMediaQuery((theme) =>
      (theme as Theme).breakpoints.down('sm'),
    );
    if (onePageLayout)
      return (
        <OnePageLayout opened={store.appUI.activeRoomId !== undefined}>
          <SecondaryPanelContent store={store} />
        </OnePageLayout>
      );
    else
      return (
        <TwoPageLayout opened={store.appUI.activeRoomId !== undefined}>
          <SecondaryPanelContent store={store} />
        </TwoPageLayout>
      );
  },
);

const GridAnimated = styled(Grid)(({ theme }) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const SecondaryPanelContent = observer(
  ({ store }: { store: SecondaryPanelUI }) => {
    const onePageLayout = useMediaQuery((theme) =>
      (theme as Theme).breakpoints.down('sm'),
    );
    return [...store.roomsUI].map(([, roomUI]) => (
      <Stack
        height={'100%'}
        display={store.appUI.activeRoomId === roomUI.roomId ? 'flex' : 'none'}
      >
        <SecondaryBar store={roomUI.roomBarUI} />
        <Grid container flexGrow={1}>
          <GridAnimated
            display={
              roomUI.roomUsersUI.opened && onePageLayout ? 'none' : 'flex'
            }
            xs={roomUI.roomUsersUI.opened ? 0 : 12}
            md={roomUI.roomUsersUI.opened ? 9 : 12}
            flexDirection={'column'}
          >
            <RoomMessages store={roomUI.roomMessagesUI} />
            <RoomInput store={roomUI.roomInputUI} />
          </GridAnimated>
          <GridAnimated
            xs={roomUI.roomUsersUI.opened ? 12 : 0}
            md={roomUI.roomUsersUI.opened ? 3 : 0}
          >
            <RoomInfo store={roomUI.roomUsersUI} />
          </GridAnimated>
        </Grid>
      </Stack>
    ));
  },
);
