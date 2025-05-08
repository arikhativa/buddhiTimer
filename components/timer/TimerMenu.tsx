import { Menu } from '~/lib/icons/Menu';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { P } from '../ui/typography';
import { sheardStrings } from '~/lib/strings/sheard';

interface Props {
  onDelete: () => void;
}

export default function TimerMenu({ onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button onPress={onDelete} variant="ghost">
              <P className="color-destructive">{sheardStrings.delete}</P>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
