export interface BrandData {
    name: string;
    brandName?: string;
    logo: string;
}

export const brands: BrandData[] = [
    { name: "Big Green Egg", logo: "/brand-logos/biggreenegg-logo-primary-square-pantone343c.avif" },
    { name: "Bull", brandName: "Bull BBQ", logo: "/brand-logos/BULL_EMBLEM_logo1RED.avif" },
    { name: "Traeger", logo: "/brand-logos/traeger-logo.avif" },
    { name: "Napoleon", logo: "/brand-logos/napoleon.png" },
    { name: "Blaze", logo: "/brand-logos/Blaze_Logo_071522.avif" },
    { name: "Fire Magic", logo: "/brand-logos/FM_Logo_Full-Color72.webp" },
    { name: "Profire", logo: "/brand-logos/PROFIRE-gas-grill-logo-grillparts.com.avif" },
    { name: "AOG", brandName: "American Outdoor Grill", logo: "/brand-logos/aog_full_logo_color_no_box.avif" },
    { name: "Blackstone", logo: "/brand-logos/blackstone.avif" },
    { name: "Charlie", logo: "/brand-logos/Charlie.avif" },
];
