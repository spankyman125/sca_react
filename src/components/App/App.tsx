import { Box, Modal, Slide, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppStore from '../../stores/ui/App/AppStore';
import { MainPanel } from './MainPanel/MainPanel';
import { SecondaryPanel } from './SecondaryPanel/SecondaryPanel';

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
        <Centered>
          <Typography>No room selected</Typography>
        </Centered>
      )}
    </>
  );
};

const Centered = styled('div')(({ theme }) => ({
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  backgroundColor: theme.palette.grey[900],
}));

const App = observer(() => {
  const [appStore] = useState(() => new AppStore());
  const params = useParams();
  appStore.setActive(params.roomId ? +params.roomId : undefined);

  return (
    <Grid container>
      <Grid md={3} sm={4} xs={12} height={'100vh'}>
        <MainPanel store={appStore.mainPanelUI} />
      </Grid>
      <Grid md={9} sm={8} xs={0} height={'100vh'} bgcolor={'grey.700'}>
        <SecondaryPanel store={appStore.secondaryPanelUI} />
      </Grid>
    </Grid>
  );
});

export default App;
