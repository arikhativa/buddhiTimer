import { UseQueryResult } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Muted } from '../ui/typography';
import { spinnerStrings } from '~/lib/strings/spinner';
import { Banana } from 'lucide-react-native';

type Props<T> = PropsWithChildren & {
  query: UseQueryResult<T>;
  allowEmpty?: boolean;
};

export function Spinner<T>({ allowEmpty, query, children }: Props<T>) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (query.isLoading) {
      timeout = setTimeout(() => {
        setShowSpinner(true);
      }, 500);
    } else {
      setShowSpinner(false);
    }

    return () => clearTimeout(timeout);
  }, [query.isLoading]);

  if (query.isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Muted>{spinnerStrings.error}</Muted>
      </View>
    );
  }

  if (query.isLoading && showSpinner) {
    return (
      <View className="flex-1 justify-center items-center">
        <Banana size={60} />
      </View>
    );
  }

  if (!allowEmpty && !query.data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Muted>{spinnerStrings.noData}</Muted>
      </View>
    );
  }

  return <>{children}</>;
}
