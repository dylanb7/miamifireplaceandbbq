import type { ContactOption } from "@/components/contact-us";
import taxonomy from "./taxonomy.json";

// Categories from taxonomy
const categories = Object.keys(taxonomy) as (keyof typeof taxonomy)[];

export const interestOptions: ContactOption[] = [
    ...categories.map(category => ({
        label: category,
        value: category
    })),
    { label: "General Inquiry", value: "general" },
    { label: "Support", value: "support" },
];

export const productOptions: Record<string, ContactOption[]> = categories.reduce((acc, category) => {
    acc[category] = taxonomy[category].map(brand => ({
        label: brand,
        value: brand
    }));
    return acc;
}, {} as Record<string, ContactOption[]>);

