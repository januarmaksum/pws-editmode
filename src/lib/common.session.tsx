'use server';

import { cookies } from 'next/headers';

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionId')?.value || null;
  return { token };
};
