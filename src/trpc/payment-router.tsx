import { z } from "zod";
import {
  privateProcedure,
  publicProcedure,
  router,
} from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";


// The paymentRouter is defined using TRPC's router function and contains two procedures: 
// createSession and pollOrderStatus.

export const paymentRouter = router({
  createSession: privateProcedure
    // Defines the input schema using Zod, expecting an array of product IDs.
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {

      // Context object containing user information
      const { user } = ctx;
      // Contains the input data for the procedure.
      let { productIds } = input;

      // If array is empty. Throws a BAD_REQUEST error.
      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient();

      // Uses the Payload CMS client to fetch products based on the provided IDs.
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      })

      // Keeps products with a valid priceId.
      const filteredProducts = products.filter((prod: { priceId: any; }) =>
        Boolean(prod.priceId)
      )

      // Creates an order in the Payload CMS with the fetched products and marks it as unpaid.
      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod: { id: any; }) => prod.id),
          user: user.id,
        },
      })

      // Prepares line items for the Stripe checkout session.
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product: { priceId: string | undefined; }) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        })
      })

      line_items.push({
        price: 'price_1OCeBwA19umTXGu8s4p2G3aX',
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })

      // Creates a Stripe checkout session with the prepared line items, and returns the session URL.
      try {
        const stripeSession =
          await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
            payment_method_types: ['card', 'paypal'],
            mode: 'payment',
            metadata: {
              userId: user.id,
              orderId: order.id,
            },
            line_items,
          })

        return { url: stripeSession.url }
      } catch (err) {
        return { url: null }
      }
    }),


  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders;
      
      // Returns whether the order is paid
      return { isPaid: order._isPaid }
    }),
})