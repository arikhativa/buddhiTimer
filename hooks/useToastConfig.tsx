import { StyleProp, ViewStyle } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
// import { NAV_THEME } from '~/lib/constants';

const contentContainerStyle: StyleProp<ViewStyle> = {
  maxWidth: '60%',
};

// const dark: StyleProp<ViewStyle> = {
//   backgroundColor: NAV_THEME.dark.background,
// };

// const light: StyleProp<ViewStyle> = {
//   backgroundColor: NAV_THEME.light.background,
// };

export default function useToastConfig(
  _isDarkColorScheme: boolean,
): ToastConfig {
  // const container = isDarkColorScheme ? dark : light;

  return {
    success: props => <BaseToast {...props} style={[contentContainerStyle]} />,
    error: props => <ErrorToast {...props} style={[contentContainerStyle]} />,
  };
}
