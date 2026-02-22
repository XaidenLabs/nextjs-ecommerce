import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      {/* Trust Badges Section */}
      <div className="w-full flex flex-col lg:flex-row pb-5 bg-white lg:h-[40vh] h-auto justify-center items-center">
        <div className="lg:w-[25%] lg:pt-0 pt-10 h-full justify-center items-center flex">
          <div className="w-[80%] text-center">
            <div className="items-center justify-center flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <h1 className="text-center pt-5 lg:font-medium text-xl">Secured Payment</h1>
            <p className="text-center pt-2 opacity-60 text-sm">
              Enjoy peace of mind with our secured payment options!
            </p>
          </div>
        </div>
        <div className="lg:w-[25%] lg:pt-0 pt-16 h-full justify-center items-center flex">
          <div className="w-[80%] text-center">
            <div className="items-center justify-center flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" /><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><path d="M12 1v4" /></svg>
            </div>
            <h1 className="text-center pt-5 lg:font-medium text-xl">Shipping</h1>
            <p className="text-center pt-2 opacity-60 text-sm">
              Get your order fast with our speedy shipping options!
            </p>
          </div>
        </div>
        <div className="lg:w-[25%] lg:pt-0 pt-16 h-full justify-center items-center flex">
          <div className="w-[80%] text-center">
            <div className="items-center justify-center flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
            </div>
            <h1 className="text-center pt-5 lg:font-medium text-xl">Live Chat</h1>
            <p className="text-center pt-2 opacity-60 text-sm">
              Need help? Our live chat is here for instant support!
            </p>
          </div>
        </div>
        <div className="lg:w-[25%] lg:pt-0 pt-16 pb-10 lg:pb-0 h-full justify-center items-center flex">
          <div className="w-[80%] text-center">
            <div className="items-center justify-center flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <h1 className="text-center pt-5 lg:font-medium text-xl">Checkout</h1>
            <p className="text-center pt-2 opacity-60 text-sm">
              Easy checkout — complete your order in seconds!
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-black text-[#8B8B8B] w-full lg:flex lg:flex-row flex-col justify-center py-10">
        <div className="lg:w-[15%] lg:px-5 px-10 pt-5 leading-7">
          <h1 className="text-white">Customer Services</h1>
          <p className="pt-1 hover:text-white cursor-pointer transition-colors">Customer Care</p>
          <p className="hover:text-white cursor-pointer transition-colors">Shipping</p>
          <p className="hover:text-white cursor-pointer transition-colors">Orders &amp; Payments</p>
          <p className="hover:text-white cursor-pointer transition-colors">Returns</p>
          <p className="hover:text-white cursor-pointer transition-colors">FAQ</p>
          <p className="hover:text-white cursor-pointer transition-colors">My Account</p>
        </div>
        <div className="lg:w-[15%] px-10 pt-5 leading-7">
          <h1 className="text-white">Company</h1>
          <p className="pt-1 hover:text-white cursor-pointer transition-colors">About Us</p>
          <p className="hover:text-white cursor-pointer transition-colors">Careers</p>
          <p className="hover:text-white cursor-pointer transition-colors">Contact Us</p>
          <p className="hover:text-white cursor-pointer transition-colors">Editorial</p>
        </div>
        <div className="lg:w-[15%] px-10 pt-5 leading-7">
          <h1 className="text-white">Categories</h1>
          <p className="pt-1 hover:text-white cursor-pointer transition-colors">New Arrivals</p>
          <p className="hover:text-white cursor-pointer transition-colors">Men</p>
          <p className="hover:text-white cursor-pointer transition-colors">Women</p>
          <p className="hover:text-white cursor-pointer transition-colors">T-shirts</p>
          <p className="hover:text-white cursor-pointer transition-colors">Pants</p>
        </div>
        <div className="lg:w-[15%] px-10 pt-5 leading-7">
          <h1 className="text-white">Policies</h1>
          <p className="pt-1 hover:text-white cursor-pointer transition-colors">Exchange Policy</p>
          <p className="hover:text-white cursor-pointer transition-colors">Return Policy</p>
          <p className="hover:text-white cursor-pointer transition-colors">Refund Policy</p>
          <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
          <p className="hover:text-white cursor-pointer transition-colors">Cookie Policy</p>
        </div>
        <div className="lg:w-[30%] px-10 pt-5">
          <h1 className="text-white">Join Our List</h1>
          <p className="pt-1 text-sm">
            Receive updates on our latest products, releases and exclusive partnerships.
          </p>
          <div className="flex gap-5 pt-4">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="footer-men" className="accent-white" />
              <label htmlFor="footer-men" className="text-sm">Men</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="footer-women" className="accent-white" />
              <label htmlFor="footer-women" className="text-sm">Women</label>
            </div>
          </div>
          <div className="pt-6 relative">
            <input
              type="email"
              placeholder="Enter Email"
              className="bg-transparent border border-gray-400 w-[90%] h-[50px] rounded-lg pl-3 pr-10 text-sm focus:outline-none focus:border-white transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[15%] top-1/2 -translate-y-1/2 mt-3"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
          <div className="flex gap-4 pt-7 text-white">
            <FaFacebook className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
            <FaInstagram className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
            <FaTwitter className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
            <FaTiktok className="hover:text-gray-400 cursor-pointer transition-colors" size={18} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <hr className="border-gray-700" />
      <div className="h-auto lg:h-[20vh] w-full bg-black text-[#8B8B8B] px-10 lg:px-16 py-6">
        <div className="flex gap-2">
          <Image src="/assets/visa.png" alt="Visa" width={30} height={20} className="h-[20px] w-auto" />
          <Image src="/assets/mastercard.png" alt="Mastercard" width={30} height={20} className="h-[20px] w-auto" />
          <Image src="/assets/am express.jpeg" alt="American Express" width={30} height={20} className="h-[20px] w-auto" />
          <Image src="/assets/paypal.png" alt="PayPal" width={30} height={20} className="h-[20px] w-auto" />
          <Image src="/assets/diners club.png" alt="Diners Club" width={30} height={20} className="h-[20px] w-auto" />
          <Image src="/assets/discover.png" alt="Discover" width={30} height={20} className="h-[20px] w-auto" />
        </div>
        <h1 className="pt-5 text-sm">Powered by BLUEPETALS FASHION</h1>
        <p className="text-xs pt-1">© 2025, Bluepetals. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
