import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Creates a transporter object using SMTP configuration.
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
})

// Attempts to retrieve the cached Payload client from the global object.
let cached = (global as any).payload;
/* If the cached client does not exist, initializes it as an empty object 
with client and promise properties. */
if (!cached) {
    cached = (global as any).payload = {
      client: null,
      promise: null,
    }
}

interface Args {initOptions?: Partial<InitOptions>}

// Defines an async function to get the Payload client.
export const getPayloadClient = async({initOptions} : Args = {}) => {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET is missing!");
      }
    
    if (cached.client) {
        return cached.client;
    }

    // Initialize payload client.
    if(!cached.client) {
        cached.promise = payload.init({
            email: {
                transport: transporter,
                fromAddress: "onboarding@resend.dev",
                fromName: "FlashCommerce"
            },
            secret: process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true, ...(initOptions || {})
        })
    }

    /* Awaits the initialization promise and caches the client.
    Resets the promise to null and rethrows the error if initialization fails. */
    try {
        cached.client = await cached.promise;
      } catch (err: unknown) {
        cached.promise = null;
        throw err;
      }
      // Return Initialized client.
      return cached.client;
    
}
