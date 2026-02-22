"use client";

const NewsletterSection = () => {
    return (
        <div className="bg-[#EFEFEF] w-full h-[30vh] lg:h-[65vh] justify-center items-center flex">
            <div className="w-[90%] sm:w-[70%] lg:w-[35%] text-center">
                <h1 className="text-2xl lg:text-5xl font-light">
                    Be First. Never Follow.
                </h1>
                <p className="text-center pt-5 text-gray-400">
                    Access the latest drops and insider exclusives.
                </p>
                <div className="w-full relative mt-5">
                    <input
                        type="email"
                        placeholder="email@example.com"
                        className="h-12 w-full rounded-lg border border-gray-300 pl-4 pr-28 focus:outline-none focus:border-black transition-colors"
                    />
                    <button className="absolute bg-black text-white right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsletterSection;
