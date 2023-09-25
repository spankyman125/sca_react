import { Socket, io } from 'socket.io-client';

// interface ServerToClientEvents {
//   noArg: () => void;
//   basicEmit: (a: number, b: string, c: Buffer) => void;
//   withAck: (d: string, callback: (e: number) => void) => void;
// }

// interface ClientToServerEvents {
//   hello: () => void;
// }

export default class SocketService {
  io: Socket;

  constructor(access_token: string) {
    const url =
      process.env.NODE_ENV === 'development'
        ? `wss://${location.hostname}:30125/`
        : `wss://${location.host}/`;

    this.io = io(`wss://${url}`, {
      extraHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  }
}
