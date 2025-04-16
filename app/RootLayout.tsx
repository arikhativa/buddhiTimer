import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
  StaticParamList,
} from '@react-navigation/native';
import * as React from 'react';
import {Platform, StatusBar} from 'react-native';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStaticNavigation} from '@react-navigation/native';
import {
  HomeScreen,
  title as homeTitle,
  initParams as homeParams,
} from './HomeScreen';
import {ErrorScreen} from './ErrorScreen';
import {SettingsScreen} from './SettingsScreen';
import {PortalHost} from '@rn-primitives/portal';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Settings',
  screenOptions: {
    headerStyle: {backgroundColor: 'tomato'},
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: homeTitle,
      },
      initialParams: homeParams,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

interface Props {
  showErrorScreen: boolean;
}

export default function RootLayout({showErrorScreen}: Props) {
  const hasMounted = React.useRef(false);
  const {isDarkColorScheme} = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar
        barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkColorScheme
            ? DARK_THEME.colors.background
            : LIGHT_THEME.colors.background
        }
      />
      {showErrorScreen ? (
        <ErrorScreen />
      ) : (
        <>
          <Navigation theme={isDarkColorScheme ? DARK_THEME : LIGHT_THEME} />
          <PortalHost />
        </>
      )}
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' // && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
