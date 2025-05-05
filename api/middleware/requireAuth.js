
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import 'dotenv/config';

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not defined in the environment variables. Please add it to your .env file.');
}

const requireAuth = ClerkExpressRequireAuth({});

export default requireAuth;
