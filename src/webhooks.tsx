import express from "express";
import { WebhookRequest } from "./server";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { getPayloadClient } from "./get-payload";
import { Product } from "./payload-types";
import { Resend } from "resend";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";

// Initialize the resend client.
const resend = new Resend(process.env.RESEND_API_KEY);

// Defines an asynchronous function to handle incoming webhook requests.
export const stripeWebhookHandler = async (req: express.Request, res: express.Response) => {
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`);
  }

  /* Extracts the session object from the event and checks for required metadata 
  (userId and orderId). If missing, returns a 400 status. */
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res
      .status(400)
      .send(`Webhook Error: No user present in metadata`);
  }

  // Checks if the event type is checkout.session.completed.
  if (event.type === "checkout.session.completed") {
    // Retrieves the Payload CMS client.
    const payload = await getPayloadClient();

    // Finds the user by userId in the users collection. If not found, returns a 404 status.
    try {
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          id: {
            equals: session.metadata.userId,
          },
        },
      });

      const [user] = users || [];

      if (!user) {
        return res
          .status(404)
          .json({ error: "The user doesn't exist." });
      }

      // Finds the order by orderId in the orders collection. If not found, returns a 404 status.
      const { docs: orders } = await payload.find({
        collection: "orders",
        depth: 2,
        where: {
          id: {
            equals: session.metadata.orderId,
          },
        },
      });

      const [order] = orders || [];

      if (!order) {
        return res
          .status(404)
          .json({ error: "The order doesn't exist." });
      }

      // Updates the order's _isPaid field to true.
      await payload.update({
        collection: "orders",
        data: {
          _isPaid: true,
        },
        where: {
          id: {
            equals: session.metadata.orderId,
          },
        },
      });

      // Send receipt
      const data = await resend.emails.send({
        from: "FlashCommerce <hello@example.com>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      });

      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: "Error processing webhook." });
    }
  }

  return res.status(200).send();
};
