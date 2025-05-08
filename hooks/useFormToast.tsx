import Toast from 'react-native-toast-message';
import { toastString } from '~/lib/strings/toastStrings';

export default function useFormToast() {
  const saveSuccess = () => {
    Toast.show({
      type: 'success',
      text1: toastString.saveSuccess,
    });
  };

  const saveError = () => {
    Toast.show({
      type: 'error',
      text1: toastString.saveError,
    });
  };

  const deleteSuccess = () => {
    Toast.show({
      type: 'success',
      text1: toastString.deleteSuccess,
    });
  };
  deleteSuccess;
  return { saveSuccess, saveError, deleteSuccess };
}
