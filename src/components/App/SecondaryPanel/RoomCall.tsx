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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  return (
    <Box bgcolor={'grey.900'}>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', gap: 10, flexGrow: 1 }}>
            <Typography sx={{ alignSelf: 'center' }}>
              Call in progress
            </Typography>
            <AvatarGroup sx={{ flexGrow: 1 }}>
              {store.userConsumers.map(({ user }) => (
                <Avatar
                  alt={user.pseudonym}
                  src={STATIC_URL + user.avatarUrl}
                  sx={{ width: 30, height: 30 }}
                />
              ))}
            </AvatarGroup>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </Box>
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
          backgroundSize: 'contain',
          overflow: 'hidden',
        }}
      >
        <AudioVisualizer track={track} />
      </Paper>
    );
  },
);

export default RoomCall;
