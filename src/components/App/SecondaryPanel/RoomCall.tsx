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
// Lib has wrong package.json, can be fixed by copying "types" field into "exports"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { User } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import RoomCallUI from '../../../stores/ui/App/RoomPanel/RoomCallUI';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  if (store.callInProgress)
    return (
      <Box bgcolor={'grey.900'}>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', gap: 10, flexGrow: 1 }}>
              <Typography sx={{ alignSelf: 'center' }}>
                Call in progress
              </Typography>
              <AvatarGroup sx={{ flexGrow: 1 }}>
                {store.userAudios.map(({ user }) => (
                  <Avatar
                    key={user.id}
                    alt={user.pseudonym}
                    src={STATIC_URL + user.avatarUrl}
                    sx={{ width: 30, height: 30 }}
                  />
                ))}
              </AvatarGroup>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid2 container spacing={2} maxHeight={300} paddingBottom={5}>
              {store.userAudios.map(({ user, recorder }) => (
                <Grid2
                  key={user.id}
                  xs
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexBasis={'auto'}
                >
                  <UserCallBadge recorder={recorder} user={user} />
                </Grid2>
              ))}
            </Grid2>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
});

const AudioVisualizer = observer(
  ({ recorder }: { recorder: MediaRecorder }) => {
    return (
      <LiveAudioVisualizer
        mediaRecorder={recorder}
        width={100}
        height={100}
        barWidth={2}
        gap={1}
        barColor={'#f76565'}
      />
    );
  },
);

const UserCallBadge = observer(
  ({ user, recorder }: { user: User; recorder: MediaRecorder }) => {
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
        <AudioVisualizer recorder={recorder} />
      </Paper>
    );
  },
);

export default RoomCall;
