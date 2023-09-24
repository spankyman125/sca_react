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
    this.io = io(`wss://${location.host}`, {
      extraHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  }
}
