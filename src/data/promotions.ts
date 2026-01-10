import type { Promotion } from "./types";

export const promotions: Promotion[] = [
    {
        id: "hot-tub-financing-event",
        title: "Hot Tub Financing Event",
        description: "Available from now until the end of the month.",
        details: "0% APR for 60 Months\nor 0% APR for 36 Months*",
        eligibleCategories: ["Hot Tubs"]
    },
    {
        id: "caldera-upgrade-event",
        title: "Caldera Spas Upgrade",
        description: "Receive a free cover lifter with any purchase.",
        details: "Free Cover Lifter",
        eligibleCategories: ["Hot Tubs"],
        eligibleBrands: ["Caldera Spas"]
    },
    {
        id: "fantasy-clearance",
        title: "Drift Clearance",
        description: "Floor model clearance sale.",
        details: "Save $500",
        eligibleCategories: ["Hot Tubs"],
        eligibleProducts: ["fantasy-drift"]
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
