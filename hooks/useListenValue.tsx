import { useEffect } from 'react';
import { eventEmitter } from '~/lib/events';

export function useListenValue<T>(event: string, f: (v: T) => void) {
  useEffect(() => {
    eventEmitter.on(event, f);

    return () => {
      eventEmitter.off(event);
    };
  }, []);
}
