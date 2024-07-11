import { User } from "@/payload-types";
import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";

/* Initializes a TRPC instance with a context type of ExpressContext
and creates the TRPC instance. */
const t = initTRPC.context<ExpressContext>().create();
// Extracts the middleware functionality from the TRPC instance for defining custom middlewares.
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest

  const { user } = req as { user: User | null }

  // Throws UNAUTHORIZED error if user is not authenticated.
  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  /* If the user is authenticated, proceeds to the next middleware or resolver, 
  adding the user to the context. */
  return next({
    ctx: {
      user,
    },
  })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);