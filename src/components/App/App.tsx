import { Box, Modal, Slide, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppStore from '../../stores/ui/App/AppStore';
import { RoomPanel } from './RoomPanel/RoomPanel';
import { MainPanel } from './MainPanel/MainPanel';

export type Theme = {
  breakpoints: {
    down: (breakpoint: string) => string;
  };
};

export const OnePageLayout = ({
  children,
  opened,
}: {
  children: React.ReactNode;
  opened: boolean;
}) => {
  return (
    <Modal open={opened} keepMounted closeAfterTransition>
      <Slide direction="up" in={opened}>
        <Box height={'100%'}>{children}</Box>
      </Slide>
    </Modal>
  );
};

export const TwoPageLayout = ({
  children,
  opened,
}: {
  children: React.ReactNode;
  opened: boolean;
}) => {
  return (
    <>
      {children}
      {!opened && (
        <Box
          height={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          display={'flex'}
          bgcolor={'grey.900'}
        >
          <Typography>No room selected</Typography>
        </Box>
      )}
    </>
  );
};

const App = memo(function App() {
  const [appUI] = useState(() => new AppStore());
  const params = useParams();
  appUI.setActive(params.roomId ? +params.roomId : undefined);

  return (
    <Grid container>
      <Grid md={3} sm={4} xs={12} height={'100vh'}>
        <MainPanel store={appUI.mainPanelUI} />
      </Grid>
      <Grid md={9} sm={8} xs={0} height={'100vh'} bgcolor={'grey.700'}>
        <RoomPanel store={appUI.roomPanelUI} />
      </Grid>
    </Grid>
  );
});

export default App;
