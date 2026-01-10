export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductType;
    brand?: string;
    model?: string;
    image: string;
}

export interface ProductDetails {

}



export type ProductType = "Hot Tubs" | "Outdoor Kitchens" | "Grills" | "Fireplaces" | "Gas Logs";

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
    specifications?: Record<string, string>;
    videoUrl?: string; // YouTube or Vimeo ID/URL
    downloads?: { title: string; url: string }[];
}
