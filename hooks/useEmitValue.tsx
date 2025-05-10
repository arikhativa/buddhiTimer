import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { eventEmitter } from '~/lib/events';

export function useEmitValue<T>(event: string, value: T) {
  const navigation = useNavigation();
  const state = useState(value);
  const [local] = state;

  const localRef = useRef(local);
  useLayoutEffect(() => {
    localRef.current = local;
  }, [local]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      eventEmitter.emit(event, localRef.current);
    });
    return unsubscribe;
  }, [navigation]);

  return state;
}
