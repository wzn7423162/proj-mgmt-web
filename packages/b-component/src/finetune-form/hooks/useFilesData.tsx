import { FILES_DATA_KEY } from '@llama-fa/constants';
import { filesUserDatasets } from '@llama-fa/core/api';
import { useQuery } from '@tanstack/react-query';

export const useFilesData = () => {
  const { data: fileDatas, ...restQuery } = useQuery({
    queryKey: [FILES_DATA_KEY],
    queryFn: () => {
      return filesUserDatasets(
        {},
        {
          extra: {
            hideErrorMessage: true,
          },
        }
      );
    },
    gcTime: 1000 * 5,
    staleTime: 1000 * 5,
  });

  return {
    fileDatas,
    restQuery,
  };
};
