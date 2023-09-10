import { Box, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import RoomCallUI from '../../../stores/ui/App/RoomPanel/RoomCallUI';

const RoomCall = observer(({ store }: { store: RoomCallUI }) => {
  return (
    <Box height={300} bgcolor={'grey.900'}>
      Local
      {store.mediasoupStore.streams.local && (
        <Audio stream={store.mediasoupStore.streams.local} />
      )}
      Remote:
      {store.mediasoupStore.streams.remote.map((stream, index) => {
        return (
          <>
            {index}
            <Audio stream={stream} />
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

const Audio = observer(({ stream }: { stream: MediaStream }) => {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  return (
    <>
      <LiveAudioVisualizer
        mediaRecorder={mediaRecorder}
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
