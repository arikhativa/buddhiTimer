import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { AppStateStatus, Platform } from 'react-native';
import RootLayout from './app/RootLayout';
import './global.css';
import { useAppState } from './hooks/useAppState';
import { useDatabase } from './hooks/useDatabase';
import { useOnlineManager } from './hooks/useOnlineManager';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

function App(): React.JSX.Element {
  const { success, error } = useDatabase();

  useOnlineManager();
  useAppState(onAppStateChange);

  const showErrorScreen = !success && !!error;

  if (showErrorScreen) {
    console.error('DB issue: ', error);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout showErrorScreen={showErrorScreen} />
    </QueryClientProvider>
  );
}

export default App;
