export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    category: ProductType;
    brand?: string;
    model?: string;
    image: string;
    images?: { url: string; alt?: string; isPrimary?: boolean }[];
    features?: string[];
    specs?: string[] | Record<string, string>;
    accessories?: string[];
    subCategories?: string[];
    misc?: { name: string; content: string[] }[];
    gallery?: string[];
    downloads?: { type: string; name: string }[];
    sourceUrl?: string;
}

export interface ProductDetails {

}



export type ProductType = "Outdoor Kitchens" | "Grills" | "Fireplaces" | "Gas Logs";

export interface Promotion {
    id: string;
    title: string;
    description: string;
    details: string;
    code?: string;
    eligibleCategories: ProductType[];
    eligibleBrands?: string[];
    eligibleProducts?: string[];
}

export interface ProductInfo {
    id: string; // Matches Product.id
    description?: string; // Markdown content
    features?: string[];
    specs?: string[];
    specifications?: Record<string, string>;
    videoUrl?: string; // YouTube or Vimeo ID/URL
    downloads?: { title: string; url: string }[];
}
