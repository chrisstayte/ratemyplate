import { toNextJsHandler } from 'better-auth/next-js';
import { authServer } from '@/auth';

export const { GET, POST } = toNextJsHandler(authServer);
