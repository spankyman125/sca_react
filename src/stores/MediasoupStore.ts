/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import {
  AppData,
  Consumer,
  DtlsParameters,
  IceCandidate,
  IceParameters,
  Producer,
  Transport,
  TransportOptions,
} from 'mediasoup-client/lib/types';
import { makeAutoObservable } from 'mobx';
import AppStore from './ui/App/AppStore';

export interface TransportParams {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export default class MediasoupStore {
  appStore: AppStore;
  device: Device | undefined = undefined;
  streams: { local: MediaStream | undefined; remote: MediaStream[] } = {
    local: undefined,
    remote: [],
  };

  transport: {
    consumer: Transport | undefined;
    producer: Transport | undefined;
  } = { consumer: undefined, producer: undefined };

  consumers: Consumer[] = [];
  producer: Producer | undefined;

  routerRtpCapabilities: RtpCapabilities | undefined = undefined;

  get roomId() {
    return this.appStore.activeRoomId;
  }

  get socketService() {
    return this.appStore.socketService;
  }

  constructor(appStore: AppStore) {
    makeAutoObservable(this);
    this.appStore = appStore;

    this.socketService.io.on('disconnect', () => {
      console.log('Mediasoup disconnected');
    });

    this.socketService.io.on('connect_error', (error) => {
      console.error(
        'Mediasoup connection failed %s (%s)',
        '/server',
        error.message,
      );
    });

    this.socketService.io.on('mediasoup:producer:new', (producerId: string) => {
      console.log('mediasoup:producer:new', producerId);
      void this.consume(producerId);
    });
  }

  async join() {
    console.log('mediasoup:join');
    await this.getRtpCapabilities();
    await this.loadDevice();
    const data = (await this.socketService.io.emitWithAck('mediasoup:join', {
      roomId: this.roomId,
    })) as {
      consumerTransportOptions: TransportOptions<AppData>;
      producerTransportOptions: TransportOptions<AppData>;
      producerIds: string[];
    };
    console.log(data);
    await this.connectProducerTransport(data.producerTransportOptions);
    this.connectConsumerTransport(data.consumerTransportOptions);
    for (let i = 0; i < data.producerIds.length; i++) {
      const producerId = data.producerIds[i];
      await this.consume(producerId);
    }
    console.log('Mediasoup room joined');
  }

  async connectProducerTransport(options: TransportOptions<AppData>) {
    const transport = this.device!.createSendTransport(options);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('mediasoup:connect:producer');
      try {
        await this.socketService.io.emitWithAck('mediasoup:connect:producer', {
          roomId: this.roomId,
          dtlsParameters,
        });
        console.log('mediasoup:connect:producer connected');
        callback();
      } catch (error) {
        console.log(error);
        errback(error);
      }
    });

    transport.on(
      'produce',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          console.log('produce');
          const { id } = await this.socketService.io.emitWithAck('produce', {
            roomId: this.roomId,
            kind,
            rtpParameters,
          });
          callback({ id });
        } catch (err) {
          console.log(error);
          errback(err);
        }
      },
    );

    transport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          console.log('mediasoup:producer:connection:connecting');
          break;

        case 'connected':
          console.log('mediasoup:producer:connection:connected');
          break;

        case 'failed':
          console.log('mediasoup:producer:connection:failed');
          transport.close();
          break;

        default:
          break;
      }
    });

    try {
      console.log('Receiving user media ...');
      const stream = await this.getUserMedia('audio');
      console.log('User media stream received');
      const track = stream.getAudioTracks()[0];
      const params = { track };
      this.producer = await transport.produce(params);
    } catch (err) {
      console.error('Mediasoup publish failed', err);
    }
  }

  connectConsumerTransport(options: TransportOptions<AppData>) {
    console.log('connectConsumerTransport');
    this.transport.consumer = this.device!.createRecvTransport(options);
    console.log('transport created');

    this.transport.consumer.on(
      'connect',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async ({ dtlsParameters }, callback, errback) => {
        console.log('mediasoup:connect:consumer');
        try {
          await this.socketService.io.emitWithAck(
            'mediasoup:connect:consumer',
            {
              roomId: this.roomId,
              dtlsParameters,
              transportId: options.id,
            },
          );
          console.log('mediasoup:connect:consumer connected');
          callback();
        } catch (error) {
          console.log(error);
          errback(error);
        }
      },
    );

    this.transport.consumer.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          console.log('Mediasoup state: connecting');
          break;

        case 'connected':
          console.log('Mediasoup state: connected');
          // console.log('Stream obj', this.stream)
          // this.socketService.io.emit('resume', { roomId: this.roomId });
          break;

        case 'failed':
          console.log('Mediasoup state: failed');
          this.transport.consumer?.close();
          break;

        default:
          break;
      }
    });
  }

  async getRtpCapabilities() {
    console.log('Receiving rtp caps ...');
    this.routerRtpCapabilities = (await this.socketService.io.emitWithAck(
      'mediasoup:getRTPCaps',
      { roomId: this.roomId },
    )) as RtpCapabilities;
    console.log('RtpCaps received:');
  }

  async loadDevice() {
    try {
      console.log('Device loading ...');
      this.device = new Device();
      await this.device.load({
        routerRtpCapabilities: this.routerRtpCapabilities!,
      });
      console.log('Device loaded');
    } catch (error) {
      console.error(error);
    }
  }

  async getUserMedia(
    type: 'audio' | 'video' | 'screenshare',
  ): Promise<MediaStream> {
    let stream: MediaStream;
    try {
      switch (type) {
        case 'audio':
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        case 'video':
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          break;
        case 'screenshare':
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          break;
      }
      this.streams.local = stream;
      return stream;
    } catch (err) {
      console.error('getUserMedia() failed:', err);
      throw err;
    }
  }

  async consume(producerId: string) {
    if (this.device) {
      console.log(`consume producerId = ${producerId}`);
      const { rtpCapabilities } = this.device;
      const data = await this.socketService.io.emitWithAck('consume', {
        roomId: this.roomId,
        rtpCapabilities,
        producerId,
      });
      const { id, kind, rtpParameters } = data;
      console.log('consume data received', data);

      const consumer = await this.transport.consumer!.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      this.consumers.push(consumer);
      this.socketService.io.emit('resume', {
        roomId: this.roomId,
        consumerId: id,
      });
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      this.streams.remote.push(stream);
      console.log('consumed stream', stream);
    } else {
      console.log('Mediasoup consume error (device not created)');
    }
  }
}
