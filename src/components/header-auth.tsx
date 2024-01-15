'use client'
import Link from 'next/link'
// These are components from a library that we installed.
// Just a time saver so we don't have to waste time styling stuff
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Input,
    Button,
    Avatar,
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import paths from "@/paths";
import * as actions from '@/actions';


export default function HeaderAuth(){
    // Using this client session so we don't have to have all sub pages
    // be dynamic routes. useSession() doesn't directly use cookies.
    // remember using cookies is what makes a page dynamic. 
    // So having cookies on our main layout header, will make every sub route dynamic. 
    // BUT WE WANT to make use of static pages so we can benefit from caching!
    const session = useSession();

    // React.ReactNode is just a typescript type that can be rendered in react
    // So make sure our authcontent is a react node type
    let authContent: React.ReactNode;
    if(session.status === "loading"){ 
        // Doing this so that while we are checking if we are authenticated, we can wait for the load. 
        // Since there is a brief period where while we are loading as authenticated, it still shows the sign in sign up buttons
        authContent = null;
    }else if (session.data?.user){
        authContent = 
        <Popover placement='left'>
            <PopoverTrigger>
                {/*Or empty string, because the user image could be null  */}
                <Avatar src={session.data.user.image || ''} /> 
            </PopoverTrigger>
            <PopoverContent>
                <div className='p-4'>
                    <form action={actions.signOut}>
                        <Button type='submit'>Sign Out</Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    } else {
        authContent = <>
            <NavbarItem>
                <form action={actions.signIn}>
                    <Button type='submit' color='secondary' variant='bordered'>
                        Sign In
                    </Button>
                </form>
            </NavbarItem>

            <NavbarItem>
                <form action={actions.signIn}>
                    <Button type='submit' color='primary' variant='flat'>
                        Sign Up 
                    </Button>
                </form>
            </NavbarItem>
        </> 
    }

    return authContent;

} 