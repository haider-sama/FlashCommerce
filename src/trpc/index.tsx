import { z } from "zod"
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";


const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
})

export type TQueryValidator = z.infer<typeof QueryValidator>


export const appRouter = router({
  // Defines the main application router with three routes, auth, payment, getInfiniteProducts.
  auth: authRouter,
  payment: paymentRouter,

  /* Defines the input schema using zod. It expects limit, cursor, query.
  Query indicates that this procedure performs a read-only operation.
  Fetches paginated products from the Payload CMS, with optional filtering and sorting. */
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query;

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<
        string,
        { equals: string }
      > = {}

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        }
      });

      const page = cursor || 1;

      //  Queries the Payload CMS for products based on the provided filters and pagination parameters.
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where: {
          approvedForSale: {
            equals: 'approved',
          },
          ...parsedQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      // Returns the fetched products and the next page cursor if there are more pages.
      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
})

export type AppRouter = typeof appRouter;