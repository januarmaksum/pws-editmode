import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AUTH_VERIFY_DOMAIN, VerifyDomainResult, verifyDomain } from './fetch';
import { VerifyDomainRequest } from './types';

/**
 * Custom hooks for the Auth Service.
 * Domain Verification - POST
 */
export const useVerifyDomain = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyDomainResult, Error, VerifyDomainRequest>({
    mutationFn: (data) => verifyDomain(data),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.setQueryData([AUTH_VERIFY_DOMAIN], result);
      }
    },
  });
};
