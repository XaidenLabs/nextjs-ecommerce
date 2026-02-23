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
    <header className="bg-white text-black w-full border-b border-gray-100 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          {/* LEFT SIDE - LOGO + NAV */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="transition-opacity hover:opacity-80">
              <span className="text-black font-serif text-2xl lg:text-3xl tracking-tighter uppercase italic">
                bluepetals
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <ul className="flex gap-8 text-[13px] uppercase tracking-widest font-medium">
                <li>
                  <Link href="/" className="hover:text-gray-500 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Men T-Shirts" className="hover:text-gray-500 transition-colors">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Women Tops" className="hover:text-gray-500 transition-colors">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/shop/Shirts & Jerseys" className="hover:text-gray-500 transition-colors">
                    Collections
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-[13px] uppercase tracking-widest font-medium hover:text-gray-500 transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-zinc-800 rounded-none text-[11px] uppercase tracking-[0.2em] px-6 h-10"
                >
                  <Link href="/register">Join Us</Link>
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
