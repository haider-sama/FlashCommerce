import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import bodyParser from "body-parser";
import { PayloadRequest } from "payload/types";
import { parse } from "url";
import { appRouter } from "./trpc";
import { stripeWebhookHandler } from "./webhooks";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({req, res,}: trpcExpress.CreateExpressContextOptions) => ({
    req,
    res,
})

export type ExpressContext = inferAsyncReturnType<
  typeof createContext
>

export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer
}

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer
    },
  })

  app.post(
    '/api/webhooks/stripe',
    webhookMiddleware,
    stripeWebhookHandler
  )

    // Initializes the Payload client with Express integration and logs the admin URL on initialization.
    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async(cms) => {
                cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
            }
        }
    });

    const cartRouter = express.Router()
    cartRouter.use(payload.authenticate);
    cartRouter.get('/', (req, res) => {
      const request = req as PayloadRequest;
  
      if (!request.user) {
        return res.redirect('/sign-in?origin=cart');
      }
      const parsedUrl = parse(req.url, true);
      const { query } = parsedUrl;
  
      return nextApp.render(req, res, '/cart', query)
    })

    app.use('/cart', cartRouter);
    
    app.use(
      '/api/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    )

    app.use((request, response) => nextHandler(request, response));

    // Prepares the Next.js application.
    nextApp.prepare().then(() => {
        payload.logger.info("NEXT.js Started");
        
        // Starts the Express server and logs the application URL.
        app.listen(PORT, async () => {
          payload.logger.info(
            `NEXT.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
          )
        })
    })
}

start();