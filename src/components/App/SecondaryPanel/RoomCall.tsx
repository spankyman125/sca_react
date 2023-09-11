import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { observer } from 'mobx-react-lite';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { User } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import RoomCallUI from '../../../stores/ui/App/RoomPanel/RoomCallUI';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  return (
    <Box bgcolor={'grey.900'} padding={2}>
      <Grid2 container spacing={2} maxHeight={300}>
        {store.userConsumers.map(({ user, track }) => (
          <Grid2
            xs
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexBasis={'auto'}
          >
            <UserCallBadge track={track} user={user} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
});

const CallInfoAccordion = observer(() => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary>
        <Typography>Call in progress</Typography>
        <AvatarGroup total={24}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
  );
});

const AudioVisualizer = observer(({ track }: { track: MediaStreamTrack }) => {
  const stream = new MediaStream();
  stream.addTrack(track);
  const recorder = new MediaRecorder(stream);
  recorder.start();
  return (
    <>
      <LiveAudioVisualizer
        mediaRecorder={recorder}
        width={100}
        height={100}
        barWidth={2}
        gap={1}
        barColor={'#f76565'}
      />
      <audio
        autoPlay
        ref={(ref) => {
          if (ref) ref.srcObject = stream;
        }}
      ></audio>
    </>
  );
});

const UserCallBadge = observer(
  ({ user, track }: { user: User; track: MediaStreamTrack }) => {
    return (
      <Paper
        elevation={2}
        sx={{
          height: 100,
          width: 100,
          borderRadius: 50,
          backgroundImage: `url(${STATIC_URL + user.avatarUrl})`,
          overflow: 'hidden',
        }}
      >
        <AudioVisualizer track={track} />
      </Paper>
    );
  },
);

export default RoomCall;
