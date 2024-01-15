'use client'

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from "next-auth/react" // This is so that we can access our session on client components

interface ProvidersProps{
    children: React.ReactNode
}

export default function Providers({children}: ProvidersProps){
    return (
        //  and we wrap with that session provider here
        <SessionProvider>
            <NextUIProvider>{children}</NextUIProvider>
        </SessionProvider>
    )
}