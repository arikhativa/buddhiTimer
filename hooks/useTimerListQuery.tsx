import { useQuery } from '@tanstack/react-query';
import { Timer, timerKeyword } from '~/db/schema';
import { USE_QUERY_STALE_TIME } from '~/lib/constants';
import { TimerService } from '~/services/timer';

export default function useTimerListQuery() {
  const query = useQuery<Timer[]>({
    queryKey: [timerKeyword],
    queryFn: () => {
      return TimerService.getMany();
    },
    staleTime: USE_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  return query;
}
