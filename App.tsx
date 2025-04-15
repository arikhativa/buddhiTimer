import './global.css';
import {useColorScheme} from 'nativewind';
import {useDatabase} from './hooks/useDatabase';
import {useEffect} from 'react';
import RootLayout from './app/RootLayout';

function App(): React.JSX.Element {
  const {settings, success, error} = useDatabase();

  const {setColorScheme} = useColorScheme();

  useEffect(() => {
    if (settings) {
      setColorScheme(settings.theme);
    }
  }, [setColorScheme, settings]);

  const showErrorScreen = !success && !!error;

  if (showErrorScreen) {
    console.error('DB issue: ', error);
  }

  return <RootLayout showErrorScreen={showErrorScreen} />;
}

export default App;
