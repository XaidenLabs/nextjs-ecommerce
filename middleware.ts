import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/product/:path*",
    "/api/billboards/:path*",
    "/api/categories/:path*",
    "/api/orders/:path*",
  ]
};
