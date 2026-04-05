import axios from 'axios';

import { apiClient } from '@/api/client';

import { VerifyDomainRequest, VerifyDomainResponse } from './types';

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
 * Uses the domain verification endpoint.
 * Automatically handles cookie storage (if successful).
 */
export const verifyDomain = async (
  data: VerifyDomainRequest
): Promise<VerifyDomainResult> => {
  try {
    // 1. Check if we already have a token (Optimization for SSR)
    // TODO: Remove this when we have a better way to handle authentication
    const existingToken = null;
    if (existingToken) {
      return {
        isSuccess: true,
        token: existingToken,
        data: null, // No fresh response data needed if token exists
      };
    }

    // 2. Otherwise, perform the verification
    const response = await apiClient.post<VerifyDomainResponse>(
      AUTH_VERIFY_DOMAIN,
      data
    );

    const token = response.data.token;

    if (token) {
      // Automatically set the cookie (universal handler handles client vs server)
      // TODO: Remove this when we have a better way to handle authentication

      return {
        isSuccess: true,
        token: token,
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

    const errorData = axios.isAxiosError(error) ? error.response?.data : error;

    return {
      isSuccess: false,
      token: null,
      data: null,
      error: errorData,
    };
  }
};
