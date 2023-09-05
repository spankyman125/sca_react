import { Box, Button } from '@mui/material';
import RoomCallUI from '../../../stores/ui/App/RoomPanel/RoomCallUI';
import { observer } from 'mobx-react-lite';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  return (
    <Box height={300} bgcolor={'grey.900'}>
      Local
      {store.mediasoupStore.localStream && (
        <Audio stream={store.mediasoupStore.localStream} />
      )}
      Remote
      {store.mediasoupStore.remoteStream && (
        <Audio stream={store.mediasoupStore.remoteStream} />
      )}
      <Button onClick={() => void store.mediasoupStore.publish('audio')}>
        Connect mediasoup
      </Button>
      <Button onClick={() => void store.mediasoupStore.publish('audio')}>
        Publish
      </Button>
      <Button onClick={() => void store.mediasoupStore.subscribe()}>
        Subscribe
      </Button>
      Call
    </Box>
  );
});

const Video = observer(({ stream }: { stream: MediaStream }) => {
  return (
    <video
      controls
      autoPlay
      height={200}
      ref={(ref) => {
        if (ref) ref.srcObject = stream;
      }}
    />
  );
});

const Audio = observer(({ stream }: { stream: MediaStream }) => {
  return (
    <audio
      controls
      autoPlay
      height={200}
      ref={(ref) => {
        if (ref) ref.srcObject = stream;
      }}
    />
  );
});

export default RoomCall;
