/**
 * Auth Service Type Definitions
 */

export interface Tenant {
  companyId: string;
  companyName: string;
  logo: string;
  domain: string;
}

export interface VerifyDomainRequest {
  domain: string;
}

export interface VerifyDomainResponse {
  token: string;
  tenant: Tenant;
}

export interface AuthErrorResponse {
  error: string;
}
