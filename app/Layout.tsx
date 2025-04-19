import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
  StaticParamList,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { HomeScreen } from './HomeScreen';
import { ErrorScreen } from './ErrorScreen';
import { SettingsScreen } from './SettingsScreen';
import { PortalHost } from '@rn-primitives/portal';
import useSettingsQuery from '~/hooks/useSettingsQuery';
import Toast from 'react-native-toast-message';
import useToastConfig from '~/hooks/useToastConfig';
import { TimerScreen } from './TimerScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerShown: false,
      },
    },
    Timer: {
      screen: TimerScreen,
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

export default function Layout({ showErrorScreen }: Props) {
  const hasMounted = React.useRef(false);
  const { data, isSuccess, isFetching } = useSettingsQuery();

  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const toastConfig = useToastConfig(isDarkColorScheme);

  React.useEffect(() => {
    if (isColorSchemeLoaded && isSuccess) {
      setColorScheme(data.theme);
    }
  }, [isColorSchemeLoaded, setColorScheme, isSuccess, data, isFetching]);

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

  const container = isDarkColorScheme
    ? styles.containerDark
    : styles.containerLight;

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
        <View className="flex-1" style={container}>
          <Navigation theme={isDarkColorScheme ? DARK_THEME : LIGHT_THEME} />
          <PortalHost />
          <Toast config={toastConfig} />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: DARK_THEME.colors.background,
  },
  containerLight: {
    backgroundColor: LIGHT_THEME.colors.background,
  },
});

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' // && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
