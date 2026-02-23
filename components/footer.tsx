import Image from "next/image";
import { FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Container from "./ui/container";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Trust Badges Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="p-12 flex flex-col items-center text-center group">
          <div className="p-4 bg-gray-50 rounded-full transition-colors group-hover:bg-black group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
          </div>
          <h1 className="mt-6 font-serif text-lg tracking-tight">Secured Payment</h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-[200px]">
            Protected transactions with industry-leading security protocols.
          </p>
        </div>
        <div className="p-12 flex flex-col items-center text-center group">
          <div className="p-4 bg-gray-50 rounded-full transition-colors group-hover:bg-black group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l-4-4 4-4" /><path d="M11 12h9" /><path d="M15 16l4-4-4-4" /></svg>
          </div>
          <h1 className="mt-6 font-serif text-lg tracking-tight">Global Shipping</h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-[200px]">
            Fast, reliable delivery to over 120 countries worldwide.
          </p>
        </div>
        <div className="p-12 flex flex-col items-center text-center group">
          <div className="p-4 bg-gray-50 rounded-full transition-colors group-hover:bg-black group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
          </div>
          <h1 className="mt-6 font-serif text-lg tracking-tight">Dedicated Support</h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-[200px]">
            Our concierge team is available 24/7 for your needs.
          </p>
        </div>
        <div className="p-12 flex flex-col items-center text-center group">
          <div className="p-4 bg-gray-50 rounded-full transition-colors group-hover:bg-black group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          </div>
          <h1 className="mt-6 font-serif text-lg tracking-tight">Premium Packaging</h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-[200px]">
            Every order is carefully prepared in our signature box.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-white text-black py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-6">
            <div className="space-y-6">
              <h1 className="font-serif text-xl tracking-tighter uppercase italic">bluepetals</h1>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Defining modern luxury through exceptional craftsmanship and timeless design.
              </p>
              <div className="flex gap-4 pt-4">
                <FaInstagram className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
                <FaTwitter className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
                <FaTiktok className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Services</h2>
              <ul className="space-y-3 text-[13px] text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">Customer Care</li>
                <li className="hover:text-black cursor-pointer transition-colors">Shipping</li>
                <li className="hover:text-black cursor-pointer transition-colors">Returns</li>
                <li className="hover:text-black cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Company</h2>
              <ul className="space-y-3 text-[13px] text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-black cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-black cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-black cursor-pointer transition-colors">Editorial</li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Newsletter</h2>
              <p className="text-[13px] text-gray-500">
                Join our list for exclusive drops and partnerships.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-transparent border-b border-gray-200 w-full py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button className="text-[11px] uppercase tracking-widest font-bold">Join</button>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest">
              © 2025 bluepetals. All rights reserved.
            </p>
            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <Image src="/assets/visa.png" alt="Visa" width={30} height={20} className="w-8" />
              <Image src="/assets/mastercard.png" alt="Mastercard" width={30} height={20} className="w-8" />
              <Image src="/assets/am express.jpeg" alt="American Express" width={30} height={20} className="w-8" />
              <Image src="/assets/paypal.png" alt="PayPal" width={30} height={20} className="w-8" />
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
