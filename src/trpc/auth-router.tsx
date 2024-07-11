import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// Router definition - Makes three routes, createPayloadUser, verifyEmail, SignIn.
// Defines input schema and then performs mutation in the data.
export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // Check if user already exists in the collection 'users'.
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      // If user doesn't exist, creates a new user with provided email, password.
      if (users.length !== 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      })

      //  Returns success and the email that was processed.
      return { success: true, sentToEmail: email }
    }),


  // Defines input schema for this route using zod to expect a string token.
  // query indicates that this route performs a read-only operation.
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {

      const { token } = input;
      const payload = await getPayloadClient();

      // Calls the verifyEmail method on the payload client to verify the email token.
      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      })

      // If verification fails, Throws an UNAUTHORIZED error.
      if (!isVerified)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      // Returns success if verification is successful.
      return { success: true }
    }),


  // Defines the input schema for this route using AuthCredentialsValidator.
  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      const payload = await getPayloadClient();

      // Calls the login method on the payload client to login the user.
      try {
        await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          res,
        })
        // If successful
        return { success: true }
      } catch (err) {
        // If fails
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),
})