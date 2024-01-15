'use server';
import * as auth from "@/auth"


export async function signOut(){
    return auth.signOut(); // Put the provider in the string that you are using
}