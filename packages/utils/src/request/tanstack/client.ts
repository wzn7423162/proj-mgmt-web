import { QueryClient } from '@tanstack/react-query';

// import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
      // gcTime: 1000 * 60 * 10, // 10mins
      // staleTime: 1000 * 60 * 10, // 10mins
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});
