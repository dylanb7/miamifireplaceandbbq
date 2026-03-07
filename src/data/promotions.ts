import type { Promotion } from "./types";

export const promotions: Promotion[] = [
    {
        id: "hot-tub-financing-event",
        title: "Hot Tub Financing Event",
        description: "Available from now until the end of the month.",
        details: "0% APR for 60 Months\nor 0% APR for 36 Months*",
        eligibleCategories: ["Grills"]
    },
    {
        id: "caldera-upgrade-event",
        title: "Caldera Spas Upgrade",
        description: "Receive a free cover lifter with any purchase.",
        details: "Free Cover Lifter",
        eligibleCategories: ["Fireplaces"],
        eligibleBrands: ["Caldera Spas"]
    },
    {
        id: "bull-grill-cover",
        title: "Free Grill Cover",
        description: "With purchase of any Bull BBQ Island.",
        details: "Free Premium Cover",
        eligibleCategories: ["Outdoor Kitchens"],
        eligibleBrands: ["Bull BBQ"]
    }
];
