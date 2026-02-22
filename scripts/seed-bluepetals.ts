import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("🌱 Starting Bluepetals seed...");

    // ─── 1. Create Sizes ───
    const sizeNames = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
    const sizes: Record<string, string> = {};

    for (const name of sizeNames) {
        const size = await db.size.upsert({
            where: { id: name },
            update: {},
            create: { name },
        });
        sizes[name] = size.id;
    }
    console.log(`✅ Created ${sizeNames.length} sizes`);

    // ─── 2. Create Billboards ───
    const billboards = [
        { billboard: "Men T-Shirts", imageURL: "/assets/men t 1.avif" },
        { billboard: "Women Tops", imageURL: "/assets/female t 1.avif" },
        { billboard: "Sweats & Hoodies", imageURL: "/assets/hoodie 1.avif" },
        { billboard: "Co-ords", imageURL: "/assets/cord 1.avif" },
        { billboard: "Shirts & Jerseys", imageURL: "/assets/tshirt 1.avif" },
        { billboard: "Slides", imageURL: "/assets/slide1.avif" },
    ];

    const billboardIds: Record<string, string> = {};
    for (const bb of billboards) {
        const created = await db.billboard.create({ data: bb });
        billboardIds[bb.billboard] = created.id;
    }
    console.log(`✅ Created ${billboards.length} billboards`);

    // ─── 3. Create Categories ───
    const categoryNames = [
        "Men T-Shirts",
        "Women Tops",
        "Sweats & Hoodies",
        "Co-ords",
        "Shirts & Jerseys",
        "Slides",
    ];

    const categoryIds: Record<string, string> = {};
    for (const name of categoryNames) {
        const cat = await db.category.create({
            data: {
                category: name,
                billboard: name,
                billboardId: billboardIds[name],
            },
        });
        categoryIds[name] = cat.id;

        // Create category sizes (S, M, L, XL for all)
        for (const sizeName of ["S", "M", "L", "XL"]) {
            await db.categorySize.create({
                data: {
                    categoryId: cat.id,
                    sizeId: sizes[sizeName],
                },
            });
        }
    }
    console.log(`✅ Created ${categoryNames.length} categories`);

    // ─── 4. Create Products ───

    interface ProductData {
        title: string;
        description: string;
        imageURLs: string[];
        category: string;
        price: number;
        finalPrice?: number;
        discount?: number;
        featured: boolean;
        sizes: string[];
        color?: string;
    }

    const allProducts: ProductData[] = [
        // ═══ MEN T-SHIRTS (from Hero.tsx products array) ═══
        {
            title: "Nigeria X Brazil Football Shirt - Yellow",
            description: "The Nigeria x Brazil Football Shirt brings clean energy to a story rooted in passion. Yellow edition with breathable build, retro collar, and standout design celebrating unity and play across continents.",
            imageURLs: ["/assets/men t 1.avif", "/assets/nigxbrayellow 1.avif", "/assets/nigxbrayellow 2.avif", "/assets/nigxbrayellow 3.avif"],
            category: "Men T-Shirts",
            price: 197,
            featured: true,
            sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        },
        {
            title: "Nigeria X Brazil Football Shirt - White",
            description: "The Nigeria x Brazil Football Shirt brings clean energy to a story rooted in passion. White edition with breathable build, retro collar, and standout design celebrating unity and play across continents.",
            imageURLs: ["/assets/men t 2.avif", "/assets/NIGERIA_X_BRAZIL_4.avif", "/assets/nigxbra2.avif", "/assets/nigxbra3.avif"],
            category: "Men T-Shirts",
            price: 197,
            featured: true,
            sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        },
        {
            title: "Knitted Neck Rib Logo T-shirt - Black",
            description: "Premium knitted neck rib logo t-shirt in black. Features a ribbed collar detail with embroidered logo. Made from high-quality cotton blend for a comfortable fit.",
            imageURLs: ["/assets/men t 3.avif", "/assets/knitted black 1.avif", "/assets/knitted black 2.avif", "/assets/knitted black 3.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Knitted Neck Rib Logo T-shirt - Blue",
            description: "Premium knitted neck rib logo t-shirt in blue. Features a ribbed collar detail with embroidered logo. Made from high-quality cotton blend for a comfortable fit.",
            imageURLs: ["/assets/men t 4.avif", "/assets/knitted blue 1.avif", "/assets/knitted blue 2.avif", "/assets/knitted blue 3.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Flame T-shirt - Black",
            description: "Bold flame graphic t-shirt in black. Features an all-over flame print with premium cotton construction.",
            imageURLs: ["/assets/men t 5.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Capoeira Graphic T-shirt - Off White",
            description: "Capoeira-inspired graphic t-shirt in off white. Features artistic print design with premium fabric.",
            imageURLs: ["/assets/men t 6.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Flame Tank Top - Black",
            description: "Flame design tank top in black. Perfect for summer with a relaxed fit and breathable fabric.",
            imageURLs: ["/assets/men t 7.avif"],
            category: "Men T-Shirts",
            price: 104,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Nigeria X Brazil Football Shirt - Off White",
            description: "Nigeria x Brazil collaborative football shirt in off white colorway.",
            imageURLs: ["/assets/men t 8.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Flame Tank Top - Blue",
            description: "Flame design tank top in blue. Perfect for summer with a relaxed fit and breathable fabric.",
            imageURLs: ["/assets/men t 9.avif"],
            category: "Men T-Shirts",
            price: 104,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Sunshine Tank - Off White",
            description: "Sunshine collection tank top in off white. Light and airy for warm weather.",
            imageURLs: ["/assets/men t 10.avif"],
            category: "Men T-Shirts",
            price: 104,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Sunshine Tank - Blue",
            description: "Sunshine collection tank top in blue. Light and airy for warm weather.",
            imageURLs: ["/assets/men t 11.avif"],
            category: "Men T-Shirts",
            price: 104,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Large Triangle Logo T-shirt - Off White",
            description: "Statement triangle logo t-shirt in off white with oversized graphic print.",
            imageURLs: ["/assets/men t 12.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Large Triangle Logo T-shirt - Black",
            description: "Statement triangle logo t-shirt in black with oversized graphic print.",
            imageURLs: ["/assets/men t 13.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Capoeira Graphic T-shirt - Black",
            description: "Capoeira-inspired graphic t-shirt in black. Features artistic print design with premium fabric.",
            imageURLs: ["/assets/men t 14.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Small Logo T-shirt - Green",
            description: "Metallic small logo t-shirt in green. Subtle branding with premium metallic finish.",
            imageURLs: ["/assets/men t 15.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Small Logo T-shirt - Blue",
            description: "Metallic small logo t-shirt in blue. Subtle branding with premium metallic finish.",
            imageURLs: ["/assets/men t 16.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Small Logo T-shirt - Black",
            description: "Metallic small logo t-shirt in black. Subtle branding with premium metallic finish.",
            imageURLs: ["/assets/men t 17.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Small Logo T-shirt - Off White",
            description: "Metallic small logo t-shirt in off white. Subtle branding with premium metallic finish.",
            imageURLs: ["/assets/men t 18.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Mask T-shirt - Green",
            description: "Mask graphic t-shirt in green with bold artistic design.",
            imageURLs: ["/assets/men t 19.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Mask T-shirt - White",
            description: "Mask graphic t-shirt in white with bold artistic design.",
            imageURLs: ["/assets/men t 20.avif"],
            category: "Men T-Shirts",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ WOMEN TOPS (from Hero.tsx clothes array) ═══
        {
            title: "Ashluxe Women A Bling Star Layered Crop Tee",
            description: "Women's A Bling Star layered crop tee in black. Features a unique layered design with star embellishments and a cropped silhouette.",
            imageURLs: ["/assets/female t 1.avif", "/assets/croptop.webp"],
            category: "Women Tops",
            price: 145,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe -A- Bodysuit - Pink",
            description: "The Ashluxe -A- Bodysuit in pink. A sleek, form-fitting bodysuit with signature A branding. Made from stretch fabric for comfort and style.",
            imageURLs: ["/assets/female t 8.avif", "/assets/bodysuitpink.avif"],
            category: "Women Tops",
            price: 83,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Female Printed Track Jacket Pink Flower Aop",
            description: "All-over printed track jacket in pink flower pattern. Features a zip-up front, ribbed cuffs and hem, and a bold floral design.",
            imageURLs: ["/assets/femaletrackjacketpinkaop.avif", "/assets/femaletrackjacketpinkaop2.webp"],
            category: "Women Tops",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Maxi Long Dress",
            description: "Elegant maxi long dress in purple/white colorway. Features a flowing silhouette with premium fabric construction.",
            imageURLs: ["/assets/fem10.avif", "/assets/170425_ASHLUXE14992.avif"],
            category: "Women Tops",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Knitted Neck Cropped T-shirt - Blue",
            description: "Cropped knitted neck t-shirt in blue. Features ribbed collar and a flattering cropped length.",
            imageURLs: ["/assets/female t 3.avif"],
            category: "Women Tops",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Logo Cropped T-shirt - Black",
            description: "Cropped t-shirt with metallic logo detail in black.",
            imageURLs: ["/assets/female t 4.avif"],
            category: "Women Tops",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Metallic Logo Cropped T-shirt - Green",
            description: "Cropped t-shirt with metallic logo detail in green.",
            imageURLs: ["/assets/female t 5.avif"],
            category: "Women Tops",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Sunshine Cropped T-shirt - Off White",
            description: "Sunshine collection cropped t-shirt in off white. Light and casual with a relaxed fit.",
            imageURLs: ["/assets/female t 6.avif"],
            category: "Women Tops",
            price: 130,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Sunshine Cropped T-shirt - Blue",
            description: "Sunshine collection cropped t-shirt in blue. Light and casual with a relaxed fit.",
            imageURLs: ["/assets/female t 7.avif"],
            category: "Women Tops",
            price: 130,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Knitted Neck Cropped T-shirt - Black",
            description: "Cropped knitted neck t-shirt in black. Features ribbed collar and a flattering cropped length.",
            imageURLs: ["/assets/female t 2.avif"],
            category: "Women Tops",
            price: 156,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ SWEATS & HOODIES (from Hero.tsx hoodies array) ═══
        {
            title: "Metallic Small Logo Sweatshirt",
            description: "Premium sweatshirt featuring a subtle metallic small logo. Heavyweight fleece construction with ribbed cuffs and hem for a comfortable, premium feel.",
            imageURLs: ["/assets/hoodie 1.avif", "/assets/METALLICSMALLLOGOSWEATSHIRT.avif", "/assets/METALLICSMALLLOGOSWEATSHIRT3.avif"],
            category: "Sweats & Hoodies",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Mask Graphic Sweatshirt",
            description: "Bold mask graphic sweatshirt in black. Features an artistic mask print with premium heavyweight fleece.",
            imageURLs: ["/assets/hoodie 2.avif", "/assets/MASKGRAPHICSWEATSHIRT1.avif", "/assets/MASKGRAPHICSWEATSHIRT2.avif"],
            category: "Sweats & Hoodies",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Triangle Logo Hoodie",
            description: "Classic triangle logo hoodie in black. Premium heavyweight fleece with kangaroo pocket and drawstring hood.",
            imageURLs: ["/assets/hoodie 3.avif", "/assets/TRIANGLELOGOHOODIE.avif", "/assets/TRIANGLELOGOHOODIE2.avif"],
            category: "Sweats & Hoodies",
            price: 207,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Bold Logo Hoodie",
            description: "Statement bold logo hoodie in black. Features oversized Ashluxe branding with premium construction.",
            imageURLs: ["/assets/hoodie 5.avif", "/assets/hoodiebold.avif"],
            category: "Sweats & Hoodies",
            price: 280,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Cyborg Sweatshirt",
            description: "Futuristic cyborg-inspired sweatshirt in black with unique graphic elements.",
            imageURLs: ["/assets/hoodie 4.avif"],
            category: "Sweats & Hoodies",
            price: 218,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Neo Logo Hoodie - Black",
            description: "Neo logo hoodie in black with modern minimalist branding.",
            imageURLs: ["/assets/hoodie 6.avif"],
            category: "Sweats & Hoodies",
            price: 218,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Neo Logo Hoodie - Purple",
            description: "Neo logo hoodie in purple with modern minimalist branding.",
            imageURLs: ["/assets/hoodie 7.avif"],
            category: "Sweats & Hoodies",
            price: 187,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Chrome Hoodie - Green",
            description: "Chrome finish hoodie in green with reflective details.",
            imageURLs: ["/assets/hoodie 8.avif"],
            category: "Sweats & Hoodies",
            price: 166,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ CO-ORDS (from Hero.tsx cords array) ═══
        {
            title: "Nigeria X Brazil Football Shorts",
            description: "Matching football shorts from the Nigeria x Brazil collaboration. Features national crests and premium athletic fabric.",
            imageURLs: ["/assets/cord 2.avif", "/assets/NIGERIAXBRAZILFOOTBALL SHORTS.png", "/assets/NIGERIA_X_BRAZIL_1.avif", "/assets/NIGERIA_X_BRAZIL_2.avif"],
            category: "Co-ords",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Monogram Denim Jacket",
            description: "Premium monogram denim jacket in blue. Features all-over Ashluxe monogram pattern with classic denim construction.",
            imageURLs: ["/assets/cord 3.avif", "/assets/monogram_denim_jacket.avif", "/assets/monogram_denim_set5.avif"],
            category: "Co-ords",
            price: 228,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Monogram Denim Pant",
            description: "Premium monogram denim pant in blue. Matches the monogram denim jacket for a complete set look.",
            imageURLs: ["/assets/cord 4.avif", "/assets/monogram_denim_pant.avif"],
            category: "Co-ords",
            price: 207,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Zip Monogram Knitted Vest",
            description: "Zip-front monogram knitted vest in purple green colorway.",
            imageURLs: ["/assets/cord 5.avif"],
            category: "Co-ords",
            price: 202,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Monogram Knitted Short",
            description: "Monogram knitted short in purple green colorway. Pairs with the knitted vest.",
            imageURLs: ["/assets/cord 6.avif"],
            category: "Co-ords",
            price: 187,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Pixel Denim Jacket",
            description: "Pixel-pattern denim jacket in green with unique digital-inspired print.",
            imageURLs: ["/assets/cord 7.avif"],
            category: "Co-ords",
            price: 311,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Pixel Denim Pant",
            description: "Pixel-pattern denim pant in green. Matching piece to the pixel denim jacket.",
            imageURLs: ["/assets/cord 8.avif"],
            category: "Co-ords",
            price: 259,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ SHIRTS & JERSEYS (from Hero.tsx shirts array) ═══
        {
            title: "Ashluxe Patch Logo T-shirt",
            description: "Premium patch logo t-shirt in black with embroidered logo patch detail.",
            imageURLs: ["/assets/tshirt 1.avif", "/assets/socks.avif"],
            category: "Shirts & Jerseys",
            price: 218,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Paradise Silver Surfer",
            description: "Paradise Silver Surfer t-shirt in black with metallic silver graphic print.",
            imageURLs: ["/assets/tshirt 2.avif"],
            category: "Shirts & Jerseys",
            price: 218,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ash American 24 Jersey - Black",
            description: "American 24 jersey in black with number print and sporty design.",
            imageURLs: ["/assets/tshirt 3.avif"],
            category: "Shirts & Jerseys",
            price: 187,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Double Zero Jersey - Yellow",
            description: "Double zero jersey in yellow with bold number design.",
            imageURLs: ["/assets/tshirt 4.avif"],
            category: "Shirts & Jerseys",
            price: 140,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Double Zero Jersey - Black",
            description: "Double zero jersey in black with bold number design.",
            imageURLs: ["/assets/tshirt 5.avif"],
            category: "Shirts & Jerseys",
            price: 140,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Racing Polo T-shirt",
            description: "Racing-inspired polo t-shirt in black with sporty design elements.",
            imageURLs: ["/assets/tshirt 6.avif"],
            category: "Shirts & Jerseys",
            price: 187,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ash American 24 Jersey - Green",
            description: "American 24 jersey in green with number print and sporty design.",
            imageURLs: ["/assets/tshirt 7.avif"],
            category: "Shirts & Jerseys",
            price: 187,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ash American 24 Jersey - Navy",
            description: "American 24 jersey in navy with number print and sporty design.",
            imageURLs: ["/assets/tshirt 8.avif"],
            category: "Shirts & Jerseys",
            price: 187,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ SLIDES (from Hero.tsx slides array) ═══
        {
            title: "Ashluxe Paradise Quilted Leather Slides - Black",
            description: "Premium quilted leather slides in black. Features padded quilted leather upper with Ashluxe branding on the footbed.",
            imageURLs: ["/assets/slide1.avif"],
            category: "Slides",
            price: 259,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Paradise Quilted Leather Slides - Brown",
            description: "Premium quilted leather slides in brown. Features padded quilted leather upper with Ashluxe branding on the footbed.",
            imageURLs: ["/assets/slide2.avif"],
            category: "Slides",
            price: 259,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Paradise Quilted Leather Slides - Blue",
            description: "Premium quilted leather slides in blue. Features padded quilted leather upper with Ashluxe branding on the footbed.",
            imageURLs: ["/assets/slide3.avif"],
            category: "Slides",
            price: 259,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Emblem Leather Slides - Green",
            description: "Emblem leather slides in green with signature crest detail on the strap.",
            imageURLs: ["/assets/slide4.avif"],
            category: "Slides",
            price: 207,
            featured: true,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Emblem Leather Slides - Black",
            description: "Emblem leather slides in black with signature crest detail on the strap.",
            imageURLs: ["/assets/slide5.avif"],
            category: "Slides",
            price: 207,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Emblem Leather Slides - Red",
            description: "Emblem leather slides in red with signature crest detail on the strap.",
            imageURLs: ["/assets/slide6.avif"],
            category: "Slides",
            price: 207,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Emblem Leather Slides - Brown",
            description: "Emblem leather slides in brown with signature crest detail on the strap.",
            imageURLs: ["/assets/slide7.avif"],
            category: "Slides",
            price: 207,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Stitched Leather Slides - Blue",
            description: "Stitched leather slides in blue with decorative stitching details.",
            imageURLs: ["/assets/slide8.avif"],
            category: "Slides",
            price: 259,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ ADDITIONAL PRODUCTS (from Customer.tsx) ═══
        {
            title: "Ashluxe Contrast Sport Jersey",
            description: "Contrast sport jersey in blue white colorway with athletic design.",
            imageURLs: ["/assets/customer 3.avif"],
            category: "Shirts & Jerseys",
            price: 214,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Festac 77 Zig Jersey - Black",
            description: "Festac 77 Zig jersey in black, inspired by the 1977 Festival of Arts and Culture.",
            imageURLs: ["/assets/customer 4.avif"],
            category: "Shirts & Jerseys",
            price: 133,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Festac 77 Zig Jersey - Multi Green Yellow",
            description: "Festac 77 Zig jersey in multi green yellow colorway.",
            imageURLs: ["/assets/customer 5.avif"],
            category: "Shirts & Jerseys",
            price: 133,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Festac 77 Zig Jersey - Cream Pink",
            description: "Festac 77 Zig jersey in cream pink colorway.",
            imageURLs: ["/assets/customer 7.avif"],
            category: "Shirts & Jerseys",
            price: 133,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Cycling Jersey",
            description: "Cycling-inspired jersey in yellow blue colorway with athletic fit.",
            imageURLs: ["/assets/customer 8.avif"],
            category: "Shirts & Jerseys",
            price: 174,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },

        // ═══ ADDITIONAL PRODUCTS (from Recent.tsx) ═══
        {
            title: "Ashluxe Ribbed Turtleneck Tee",
            description: "Ribbed turtleneck tee in black with a refined, minimalist look.",
            imageURLs: ["/assets/recent 1.avif"],
            category: "Men T-Shirts",
            price: 133,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Classic Satin Logo Swimshort",
            description: "Classic satin logo swimshort in navy. Perfect for beach or poolside.",
            imageURLs: ["/assets/recent 2.avif"],
            category: "Co-ords",
            price: 153,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Pixel Ruched Female Jersey",
            description: "Pixel ruched female jersey in blue black with a flattering ruched design.",
            imageURLs: ["/assets/recent 3.avif"],
            category: "Women Tops",
            price: 102,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Threaded Tank Top",
            description: "Threaded tank top in white black with unique texture detailing.",
            imageURLs: ["/assets/recent 4.avif"],
            category: "Men T-Shirts",
            price: 62,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Festac Heritage Tee",
            description: "Festac heritage tee in green with cultural design elements.",
            imageURLs: ["/assets/recent 6.avif"],
            category: "Men T-Shirts",
            price: 211,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
        {
            title: "Ashluxe Digital Print Sport Jersey",
            description: "Digital print sport jersey in black with modern graphic design.",
            imageURLs: ["/assets/recent 7.avif"],
            category: "Shirts & Jerseys",
            price: 221,
            featured: false,
            sizes: ["S", "M", "L", "XL"],
        },
    ];

    let productCount = 0;
    for (const p of allProducts) {
        const catId = categoryIds[p.category];
        if (!catId) {
            console.warn(`⚠️ Skipping "${p.title}" — category "${p.category}" not found`);
            continue;
        }

        const product = await db.product.create({
            data: {
                title: p.title,
                description: p.description,
                imageURLs: p.imageURLs,
                category: p.category,
                categoryId: catId,
                price: p.price,
                featured: p.featured,
            },
        });

        // Create product sizes
        for (const sizeName of p.sizes) {
            const sizeId = sizes[sizeName];
            if (sizeId) {
                await db.productSize.create({
                    data: {
                        productId: product.id,
                        sizeId: sizeId,
                        name: sizeName,
                    },
                });
            }
        }

        productCount++;
    }

    console.log(`✅ Created ${productCount} products`);
    console.log("🎉 Bluepetals seed complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
