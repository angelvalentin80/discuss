import Link from "next/link";
// These are components from a library that we installed.
// Just a time saver so we don't have to waste time styling stuff
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import paths from "@/paths";
import HeaderAuth from "@/components/header-auth";
import SearchInput from "@/components/search-input";
import { Suspense } from "react";

export default function Header() {
  return (
    <Navbar className="shadow mb-6">
      <NavbarBrand>
        <Link href={paths.home()} className="font-bold">
          Discuss
        </Link>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          {/*Search Input*/}
          <Suspense>
            <SearchInput />
          </Suspense>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* 
                This is going to show whether we are signed in or not. If we are, show profile image, if not, show sign in sign up.
                Why did we create another component for auth? Well check the HeaderAuth component and you will see. It all comes back to 
                caching and trying our best to optimize for static pages that takes advantage of caching
                 */}
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
}
