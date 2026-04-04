import { mockPageConfig } from './pageConfig';

/**
 * Simulates fetching PageConfig from a database/API.
 * Includes a 500ms artificial delay.
 */
export const fetchPageConfig = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPageConfig);
    }, 500);
  });
};

/**
 * Simulates an authentication check.
 * Includes a 200ms artificial delay.
 */
export const checkAuth = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Always return true for simulation
    }, 200);
  });
};
