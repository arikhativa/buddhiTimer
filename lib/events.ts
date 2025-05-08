import { NativeEventEmitter } from 'react-native';

const emitter = new NativeEventEmitter();

export const eventEmitter = {
  on: emitter.addListener.bind(emitter),
  off: (eventName: string) => {
    emitter.removeAllListeners(eventName);
  },
  emit: emitter.emit.bind(emitter),
};
