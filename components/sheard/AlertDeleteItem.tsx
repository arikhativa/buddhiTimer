import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Text } from '~/components/ui/text';
import { alertStrings } from '~/lib/strings/alert';
import { sheardStrings } from '~/lib/strings/sheard';

interface Props {
  open: boolean;
  toggleOpen: () => void;
  onConfirm: () => void;
  onDecline?: () => void;
}

export function AlertDeleteItem({
  open,
  toggleOpen,
  onConfirm,
  onDecline,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={toggleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertStrings.delete.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertStrings.delete.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={onDecline}>
            <Text>{sheardStrings.cancel}</Text>
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive" onPress={onConfirm}>
            <Text>{sheardStrings.confirm}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
