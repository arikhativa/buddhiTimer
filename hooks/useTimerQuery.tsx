import { useQuery } from '@tanstack/react-query';
import { Timer, timerKeyword } from '~/db/schema';
import { USE_QUERY_STALE_TIME } from '~/lib/constants';
import { TimerService } from '~/services/timer';

export default function useTimerQuery() {
  const query = useQuery<Timer>({
    queryKey: [timerKeyword],
    queryFn: TimerService.get, // TODO:
    staleTime: USE_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  return query;
}
