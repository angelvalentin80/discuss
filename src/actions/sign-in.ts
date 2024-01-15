'use server';
import * as auth from "@/auth"

export async function signIn(){
    return auth.signIn('github'); // Put the provider in the string that you are using
}