import React from 'react';
import type {PropsWithChildren} from 'react';

import './global.css';
import {useColorScheme, verifyInstallation} from 'nativewind';
import RootLayout from './app/_layout';

function App(): React.JSX.Element {
  verifyInstallation();
  const {setColorScheme} = useColorScheme();
  setColorScheme('dark');
  return <RootLayout />;
}

export default App;
