import { useQuery } from '@tanstack/react-query';
import { Timer, timerKeyword } from '~/db/schema';
import { USE_QUERY_STALE_TIME } from '~/lib/constants';
import { TimerService } from '~/services/timer';

export default function useTimerQuery(id?: number) {
  const query = useQuery<Timer>({
    queryKey: [timerKeyword, id],
    queryFn: () => {
      if (!id) throw new Error('missing id');
      return TimerService.getById(id);
    },
    staleTime: USE_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  return query;
}
