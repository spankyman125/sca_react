/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import {
  AppData,
  Producer,
  Transport,
  TransportOptions,
} from 'mediasoup-client/lib/types';
import { makeAutoObservable } from 'mobx';
import AppStore from './ui/App/AppStore';

export default class MediasoupStore {
  appStore: AppStore;
  device: Device | undefined = undefined;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
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

    this.socketService.io.on('newProducer', () => {
      console.log('Mediasoup producer created');
    });
  }

  async join() {
    console.log('Joining mediasoup room ...');
    await this.getRtpCapabilities();
    await this.loadDevice();
    await this.publish('screenshare');
    await this.subscribe();
    console.log('Mediasoup room joined');
  }

  async getRtpCapabilities() {
    console.log('Receiving rtp caps ...');
    this.routerRtpCapabilities = (await this.socketService.io.emitWithAck(
      'getRouterRtpCapabilities',
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

  async publish(mediatype: 'audio' | 'video' | 'screenshare') {
    if (this.device) {
      console.log('Creating producer transport ...');
      const data = (await this.socketService.io.emitWithAck(
        'createProducerTransport',
        {
          roomId: this.roomId,
          forceTcp: false,
          rtpCapabilities: this.device.rtpCapabilities,
        },
      )) as TransportOptions<AppData>;
      if (data.error) {
        console.error(data.error);
        return;
      }
      console.log('Producer transport created');
      console.log('Creating send transport');

      const transport = this.device.createSendTransport(data);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        console.log('connectProducerTransport');
        try {
          await this.socketService.io.emitWithAck('connectProducerTransport', {
            roomId: this.roomId,
            dtlsParameters,
          });
          console.log('connectProducerTransport connected');
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
              transportId: transport.id,
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
        console.log('Connection state changed');
        switch (state) {
          case 'connecting':
            console.log('Mediasoup connection state: publishing');
            break;

          case 'connected':
            console.log('Mediasoup connection state: connected');
            break;

          case 'failed':
            transport.close();
            console.error('Mediasoup connection state: failed');
            break;

          default:
            break;
        }
      });

      try {
        console.log('Receiving user media ...');
        const stream = await this.getUserMedia(mediatype);
        console.log('User media stream received');
        const track = stream.getVideoTracks()[0];
        const params = { track };
        this.producer = await transport.produce(params);
      } catch (err) {
        console.error('Mediasoup publish failed', err);
      }
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
      this.localStream = stream;
      return stream;
    } catch (err) {
      console.error('getUserMedia() failed:', err);
      throw err;
    }
  }

  async subscribe() {
    if (this.device) {
      console.log('Consumer transport creating ...');
      const transportOptions = (await this.socketService.io.emitWithAck(
        'createConsumerTransport',
        {
          roomId: this.roomId,
          forceTcp: false,
        },
      )) as TransportOptions;

      if (transportOptions.error) {
        console.error(transportOptions.error);
        return;
      }
      console.log('Consumer transport created');

      const transport = this.device.createRecvTransport(transportOptions);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        console.log('connectConsumerTransport');
        try {
          await this.socketService.io.emitWithAck('connectConsumerTransport', {
            roomId: this.roomId,
            dtlsParameters,
          });
          console.log('connectConsumerTransport connected');
          callback();
        } catch (error) {
          console.log(error);
          errback(error);
        }
      });

      transport.on('connectionstatechange', (state) => {
        switch (state) {
          case 'connecting':
            console.log('Mediasoup state: connecting');
            break;

          case 'connected':
            console.log('Mediasoup state: connected');
            // console.log('Stream obj', this.stream)
            this.socketService.io.emit('resume', { roomId: this.roomId });
            break;

          case 'failed':
            console.log('Mediasoup state: failed');
            transport.close();
            break;

          default:
            break;
        }
      });

      this.remoteStream = await this.consume(transport);
    }
  }

  async consume(transport: Transport<AppData>) {
    if (this.device) {
      console.log('consume');
      const { rtpCapabilities } = this.device;
      const data = await this.socketService.io.emitWithAck('consume', {
        roomId: this.roomId,
        rtpCapabilities,
      });
      const { producerId, id, kind, rtpParameters } = data;
      console.log('consume data received', data);

      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      console.log('consumed stream', stream);
      return stream;
    } else {
      console.log('Mediasoup consume error (device not created)');
    }
  }
}
