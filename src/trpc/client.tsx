import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '.';

/* This function call creates a TRPC client hook that is specifically typed to match the 
AppRouter type. This ensures that all TRPC queries and mutations you perform in your 
React application are strongly typed according to your server-side API. */
export const trpc = createTRPCReact<AppRouter>({});