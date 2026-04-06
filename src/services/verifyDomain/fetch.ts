import { apiClient } from '@/api/client';

import { VerifyDomainResponse } from './types';

export const AUTH_VERIFY_DOMAIN = '/auth/verify-domain';

/**
 * Result interface for Domain Verification
 */
export interface VerifyDomainResult {
  isSuccess: boolean;
  token: string | null;
  data: VerifyDomainResponse | null;
  error?: unknown;
}

/**
 * Fetch functions for Auth Service
 * Reads mock data from the local json mock server (mock-server.cjs).
 */
export const verifyDomain = async (): Promise<VerifyDomainResult> => {
  try {
    const response =
      await apiClient.post<VerifyDomainResponse>(AUTH_VERIFY_DOMAIN);

    const token = response.data.token;

    if (token) {
      return {
        isSuccess: true,
        token,
        data: response.data,
      };
    }

    return {
      isSuccess: false,
      token: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error('Domain Verification Service Error:', error);

    return {
      isSuccess: false,
      token: null,
      data: null,
      error,
    };
  }
};
