import Image from "next/image";

const LandingHero = () => {
    return (
        <div>
            {/* Video Banner */}
            <div className="relative w-full">
                <video
                    autoPlay
                    playsInline
                    loop
                    muted
                    preload="auto"
                    className="w-full h-auto object-cover"
                >
                    <source src="/assets/landing video.webm" type="video/webm" />
                    <source src="/assets/landing video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Text Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center px-4 justify-center gap-2 lg:justify-between h-[20vh] lg:h-[10vh] bg-white">
                <p className="text-sm lg:text-base">Introducing the Summer Capsule</p>
                <b className="text-sm lg:text-base cursor-pointer hover:underline">SHOP NOW</b>
                <p className="text-sm lg:text-base">A powerful dialogue that transcends borders.</p>
            </div>

            {/* Two Hero Images Side by Side */}
            <div className="flex">
                <div className="relative w-[50%] h-[50vh] lg:h-screen">
                    <Image
                        src="/assets/hero pic.avif"
                        alt="Summer Collection"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative w-[50%] h-[50vh] lg:h-screen">
                    <Image
                        src="/assets/hero 2.avif"
                        alt="Summer Collection"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingHero;
