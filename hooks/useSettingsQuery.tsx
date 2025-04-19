import { useQuery } from '@tanstack/react-query';
import { Settings, settingsKeyword } from '~/db/schema';
import { USE_QUERY_STALE_TIME } from '~/lib/constants';
import { SettingsService } from '~/services/settings';

export default function useSettingsQuery() {
  const query = useQuery<Settings>({
    queryKey: [settingsKeyword],
    queryFn: SettingsService.get,
    staleTime: USE_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  return query;
}
