import Image from "next/image";
import Container from "./ui/container";

const LandingHero = () => {
    return (
        <div className="bg-white">
            {/* Video Banner with Overlay */}
            <div className="relative w-full overflow-hidden">
                <video
                    autoPlay
                    playsInline
                    loop
                    muted
                    preload="auto"
                    className="w-full h-auto min-h-[40vh] object-cover md:h-[80vh]"
                >
                    <source src="/assets/landing video.webm" type="video/webm" />
                    <source src="/assets/landing video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Floating Typography Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl tracking-tighter uppercase italic drop-shadow-2xl">
                        Bluepetals
                    </h1>
                    <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium drop-shadow-lg">
                        Est. 2026 • Modern Luxury Essentials
                    </p>
                </div>
            </div>

            {/* Text Strip - Refined */}
            <div className="bg-black text-white py-6 border-y border-zinc-800">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6">
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] opacity-60 font-medium">
                            Introducing the Summer Capsule
                        </p>
                        <div className="h-px w-8 bg-zinc-700 hidden md:block"></div>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold cursor-pointer hover:text-zinc-400 transition-colors">
                            Discover the Collection — Shop Now
                        </p>
                        <div className="h-px w-8 bg-zinc-700 hidden md:block"></div>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] opacity-60 font-medium text-center">
                            A dialogue that transcends borders.
                        </p>
                    </div>
                </Container>
            </div>

            {/* Dual Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[60vh] md:h-screen group overflow-hidden cursor-pointer">
                    <Image
                        src="/assets/hero pic.avif"
                        alt="Summer Collection"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                    <div className="absolute bottom-12 left-12 text-white">
                        <h2 className="font-serif text-3xl italic tracking-tight">The Modernist</h2>
                        <p className="mt-2 text-[10px] uppercase tracking-widest opacity-80">Explore Men&apos;s</p>
                    </div>
                </div>
                <div className="relative h-[60vh] md:h-screen group overflow-hidden cursor-pointer border-t md:border-t-0 md:border-l border-white/10">
                    <Image
                        src="/assets/hero 2.avif"
                        alt="Summer Collection"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                    <div className="absolute bottom-12 left-12 text-white">
                        <h2 className="font-serif text-3xl italic tracking-tight">Ethereal Lines</h2>
                        <p className="mt-2 text-[10px] uppercase tracking-widest opacity-80">Explore Women&apos;s</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingHero;
