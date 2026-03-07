import type { ContactOption } from "@/components/contact-us";

export const interestOptions: ContactOption[] = [
    { label: "Outdoor Kitchens", value: "kitchens" },
    { label: "Grills", value: "grills" },
    { label: "Fireplaces", value: "fireplaces" },
    { label: "Gas Logs", value: "gas-logs" },
    { label: "General Inquiry", value: "general" },
    { label: "Support", value: "support" },
];

export const productOptions: Record<string, ContactOption[]> = {
    "hot-tubs": [
        { label: "Caldera Spas", value: "caldera" },
        { label: "Fantasy Spas", value: "fantasy" },
        { label: "Accessories", value: "accessories" },
    ],
    "kitchens": [
        { label: "Custom Island", value: "custom-island" },
        { label: "Grills & Appliances", value: "appliances" },
    ],
    "grills": [
        { label: "Gas Grills", value: "gas-grills" },
        { label: "Charcoal/Kamado", value: "charcoal" },
        { label: "Built-in", value: "built-in" },
    ],
    "fireplaces": [
        { label: "Indoor", value: "indoor" },
        { label: "Outdoor", value: "outdoor" },
        { label: "Electric", value: "electric" },
    ],
    "gas-logs": [
        { label: "Vented", value: "vented" },
        { label: "Vent-Free", value: "vent-free" },
    ]
};
