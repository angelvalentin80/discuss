import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter'; // These docs
import { db } from '@/db';

// Prisma Adapter uses our prisma schema and tries to create a new User record based on your User schema
// Go to the documentation for prisma-adapter, and it will tell you exactly
// what schema you need

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Do this because GITHUB ID and CLIENT SECRET can be undefined. So 
// we make sure that it is not undefined or else we throw an error
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('Missing github oauth credentials.');
}

// Here we are grabbing some stuff out of the NextAuth object. We are using destructuring
export const { handlers: { GET, POST }, auth, signOut, signIn} = NextAuth({
    adapter: PrismaAdapter(db),
    providers:[
        GitHub({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET 
        })
    ],
    callbacks: {
        // Usually this is not needed, but here we are fixing a bug in this current version of nextauth
        async session({session, user}: any){ // Wouldn't normally do any, but this is here for a bug fix
            if (session && user){
                session.user.id = user.id;
            }
            return session
        }
    }
})