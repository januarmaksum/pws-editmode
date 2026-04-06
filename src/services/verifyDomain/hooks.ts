import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AUTH_VERIFY_DOMAIN, VerifyDomainResult, verifyDomain } from './fetch';

/**
 * Custom hooks for the Auth Service.
 * Domain Verification – tidak perlu parameter domain lagi (mock selalu return data sama).
 */
export const useVerifyDomain = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyDomainResult, Error>({
    mutationFn: () => verifyDomain(),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.setQueryData([AUTH_VERIFY_DOMAIN], result);
      }
    },
  });
};
