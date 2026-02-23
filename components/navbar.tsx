import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import { Button } from "@/components/ui/button";
import NavbarSearch from "@/components/navbar-search";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import UserMenu from "@/components/user-menu";

const NavBar = async () => {
  let user = null;
  try {
    const session = await getServerSession(authOptions);
    user = session?.user ?? null;
  } catch (error) {
    console.error("[NAVBAR] Failed to get session:", error);
  }

  return (
    <header className="bg-black text-white w-full">
      <Container>
        <div className="flex items-center justify-between h-16 lg:h-[12vh] px-4 sm:px-6 lg:px-8">
          {/* LEFT SIDE - LOGO + NAV */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <Link href="/">
              <span className="text-white font-bold text-xl lg:text-2xl tracking-tight">
                blue<span className="italic font-light">petals</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <ul className="flex gap-6 text-sm">
                <li>
                  <Link href="/" className="hover:text-gray-400 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Men T-Shirts" className="hover:text-gray-400 transition-colors">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Women Tops" className="hover:text-gray-400 transition-colors">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Shirts & Jerseys" className="hover:text-gray-400 transition-colors">
                    Collections
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Search */}
            <div className="hidden sm:block">
              <NavbarSearch />
            </div>

            {/* Cart */}
            <NavbarActions />

            {/* Auth */}
            {user ? (
              <UserMenu name={user.name} email={user.email} />
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="bg-white text-black hover:bg-gray-200 rounded-sm text-xs">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-sm text-xs hidden sm:inline-flex">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default NavBar;
