import Image from "next/image";

interface SummerCapsuleBannerProps {
    image1: string;
    image2: string;
}

const SummerCapsuleBanner = ({
    image1 = "/assets/summer1.avif",
    image2 = "/assets/summer2.avif",
}: SummerCapsuleBannerProps) => {
    return (
        <div className="w-full flex">
            <div className="relative w-[50%] h-[60vh] lg:h-screen">
                <Image
                    src={image1}
                    alt="Summer Capsule"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex justify-between items-end font-semibold text-white p-5 lg:p-10">
                    <h1 className="text-sm lg:text-base">THE SUMMER CAPSULE</h1>
                    <h1 className="text-sm lg:text-base cursor-pointer hover:underline">SHOP NOW</h1>
                </div>
            </div>
            <div className="relative w-[50%] h-[60vh] lg:h-screen">
                <Image
                    src={image2}
                    alt="Summer Capsule"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex justify-between items-end font-semibold text-white p-5 lg:p-10">
                    <h1 className="text-sm lg:text-base">THE SUMMER CAPSULE</h1>
                    <h1 className="text-sm lg:text-base cursor-pointer hover:underline">SHOP NOW</h1>
                </div>
            </div>
        </div>
    );
};

export default SummerCapsuleBanner;
