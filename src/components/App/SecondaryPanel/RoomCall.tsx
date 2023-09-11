import { Box, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import RoomCallUI from '../../../stores/ui/App/RoomPanel/RoomCallUI';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  return (
    <Box height={300} bgcolor={'grey.900'}>
      Local
      {store.mediasoupStore.producer?.track && (
        <Audio track={store.mediasoupStore.producer?.track} />
      )}
      Remote:
      {[...store.mediasoupStore.consumers].map(([id, consumer]) => {
        return (
          <>
            {consumer.id}
            <Audio track={consumer.track} />
          </>
        );
      })}
      <Button onClick={() => void store.mediasoupStore.join()}>
        Join Room
      </Button>
      Call
    </Box>
  );
});

// const Video = observer(({ stream }: { stream: MediaStream }) => {
//   return (
//     <video
//       controls
//       autoPlay
//       height={200}
//       width={150}
//       ref={(ref) => {
//         if (ref) ref.srcObject = stream;
//       }}
//     />
//   );
// });

const Audio = observer(({ track }: { track: MediaStreamTrack }) => {
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

export default RoomCall;
