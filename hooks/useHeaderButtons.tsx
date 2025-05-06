import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Menu } from '~/lib/icons/Menu';

export function useHeaderButtons(showButtons: boolean) {
  const navigation = useNavigation();

  useEffect(() => {
    if (showButtons) {
      navigation.setOptions({
        headerRight: () => <Menu />,
      });
    }
  }, [navigation]);
}
