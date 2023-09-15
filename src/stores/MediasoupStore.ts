/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Device } from 'mediasoup-client';
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup-client/lib/RtpParameters';
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
import { User } from '../api/http/interfaces';

export interface TransportParams {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

class UserConsumer {
  user: User;
  consumer: Consumer;

  _audio?: HTMLAudioElement;
  _stream?: MediaStream;
  _recorder?: MediaRecorder;

  constructor(user: User, consumer: Consumer) {
    this.user = user;
    this.consumer = consumer;
  }

  play() {
    this.audio.addEventListener('canplay', () => {
      void this.audio.play();
    });
  }

  pause() {
    this.audio.pause();
  }

  private get stream(): MediaStream {
    if (!this._stream) {
      const stream = new MediaStream();
      stream.addTrack(this.consumer.track);
      this._stream = stream;
    }
    return this._stream;
  }

  get audio(): HTMLAudioElement {
    if (!this._audio) {
      const audio = new Audio();
      audio.srcObject = this.stream;
      this._audio = audio;
    }
    return this._audio;
  }

  get recorder(): MediaRecorder {
    if (!this._recorder) {
      this._recorder = new MediaRecorder(this.stream);
      this._recorder.start();
    }
    return this._recorder;
  }
}

export default class MediasoupStore {
  appStore: AppStore;
  device?: Device;

  transport: {
    consumer?: Transport;
    producer?: Transport;
  } = { consumer: undefined, producer: undefined };

  userConsumers: Map<string, UserConsumer> = new Map();
  producer?: Producer;

  routerRtpCapabilities?: RtpCapabilities;

  roomCallId?: number;

  callInProgress = false;

  get socketService() {
    return this.appStore.socketService;
  }

  constructor(appStore: AppStore) {
    makeAutoObservable(this);
    this.appStore = appStore;

    this.socketService.io.on('mediasoup:producer:new', (id: string) => {
      console.log('mediasoup:producer:new', id);
      void this.consume(id);
    });

    this.socketService.io.on('mediasoup:producer:close', (id: string) => {
      console.log('mediasoup:producer:close', id);
      this.userConsumers.forEach((userConsumer) => {
        if (userConsumer.consumer.producerId === id) {
          userConsumer.consumer.close();
          this.userConsumers.delete(userConsumer.consumer.id);
        }
      });
    });

    this.socketService.io.on('mediasoup:consumer:close', (id: string) => {
      console.log('mediasoup:consumer:close', id);
      this.userConsumers.get(id)?.consumer.close();
    });
  }

  leave() {
    this.device = undefined;
    this.socketService.io.emit('mediasoup:leave', {
      roomId: this.roomCallId,
    });
    this.transport.consumer?.close();
    this.transport.producer?.close();
    this.userConsumers = new Map();
    this.producer = undefined;
    this.routerRtpCapabilities = undefined;
    this.transport = { consumer: undefined, producer: undefined };
    this.roomCallId = undefined;
    this.callInProgress = false;
  }

  async join() {
    this.roomCallId = this.appStore.activeRoomId;
    console.log('mediasoup:join');
    await this.getRtpCapabilities();
    await this.loadDevice();
    const data = (await this.socketService.io.emitWithAck('mediasoup:join', {
      roomId: this.roomCallId,
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
    this.callInProgress = true;
  }

  async connectProducerTransport(options: TransportOptions<AppData>) {
    const transport = this.device!.createSendTransport(options);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('mediasoup:connect:producer');
      try {
        await this.socketService.io.emitWithAck('mediasoup:connect:producer', {
          roomId: this.roomCallId,
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
            roomId: this.roomCallId,
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
              roomId: this.roomCallId,
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
      { roomId: this.roomCallId },
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
      const data = (await this.socketService.io.emitWithAck('consume', {
        roomId: this.roomCallId,
        rtpCapabilities,
        producerId,
      })) as {
        id: string;
        kind: MediaKind;
        rtpParameters: RtpParameters;
        user: User;
      };
      const { id, kind, rtpParameters, user } = data;
      console.log('consume data received', data);

      const consumer = await this.transport.consumer!.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      const userConsumer = new UserConsumer(user, consumer);
      consumer.on('@close', () => {
        userConsumer.pause();
      });
      this.userConsumers.set(consumer.id, userConsumer);

      this.socketService.io.emit('resume', {
        roomId: this.roomCallId,
        consumerId: id,
      });
      userConsumer.play();
    } else {
      console.log('Mediasoup consume error (device not created)');
    }
  }
}
