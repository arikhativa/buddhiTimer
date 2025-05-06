import { PropsWithChildren } from 'react';
import { SettingsForm } from '~/components/settings/form';
import useSettingsQuery from '~/hooks/useSettingsQuery';
import { Spinner } from '~/components/sheard/Spinner';
type Props = PropsWithChildren & {};

export function SettingsScreen({}: Props) {
  const query = useSettingsQuery();

  return (
    <Spinner query={query}>
      {query.data && <SettingsForm data={query.data} />}
    </Spinner>
  );
}
