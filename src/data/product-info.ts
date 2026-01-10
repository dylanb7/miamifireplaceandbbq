import { ProductInfo } from "./types";

export const PRODUCT_INFO: Record<string, ProductInfo> = {
    "big-green-egg": {
        id: "big-green-egg",
        description: `
### The Ultimate Cooking Experience
The Big Green Egg stands alone as the most versatile barbecue or outdoor cooking product on the market, with more capabilities than all other conventional cookers combined. From appetizers to entrees to desserts, the Big Green Egg will exceed all of your expectations for culinary perfection … and with seven convenient sizes to choose from, there is a Big Green Egg to fit any lifestyle!

### Versatility
* **Grill**: Sear steaks, chops, burgers and seafood with a flavor-packed crust unmatched by other grills. High temperature "steak house" grilling – even at 750º F / 400º C – is quick and easy!
* **Roast**: Gather family and friends around the EGG for a Sunday roast. Poultry, lamb, beef and vegetables are naturally tastier because the juices and flavors stay locked inside.
* **Bake**: The Big Green Egg bakes bread, pizza, casseroles, cobblers and pies better than your kitchen oven … you may never bake indoors again!
* **Smoke**: The insulating ceramics of the Big Green Egg allow you to precisely control the temperature even at low heat. A controllable 200 to 350°F / 93 to 177°C gives succulent results with turkey, ham, lamb, chicken, ribs or any of your favorite cuts, infusing them with the aromatic wood smoke flavor.
        `,
        features: [
            "Quick and Easy to Start",
            "Precise Temperature Control",
            "Safer to Use - Ceramic surface doesn't get as hot as metal",
            "Easy to Clean up - Professional grade stainless steel cooking grids",
            "Patented Technology - State-of-the-art ceramic technologies"
        ],
        specifications: {
            "Grid Diameter": "18.25 in / 46 cm",
            "Cooking Area": "262 sq in / 1688 sq cm",
            "Weight": "162 lbs / 73 kgs",
            "Material": "High-Fire Heat-Resistant Ceramics",
            "Fuel": "Natural Lump Charcoal"
        },
        videoUrl: "https://www.youtube.com/embed/5F2oQ1c2QcE",
        downloads: [
            { title: "Owner's Manual", url: "#" },
            { title: "Warranty Information", url: "#" }
        ]
    },
    "bull-built-in": {
        id: "bull-built-in",
        description: `
### Award Winning Design
Bull Outdoor Products Inc. started in the barbecue island business over 20 years ago. Since that time, the company has reached widespread prominence in the grilling industry, having over 900 dealers and distributors throughout the United States, and Canada.

### ReliaBull Technology
The new ReliaBull heat technology was created to eliminate uneven heating on your grill, making your outdoor grilling experience extraordinary. This new technology improves heat distribution on your grill by 50%. The days of only using half of your grill are gone.

### Features
* **16 Gauge 304 Stainless Steel Burners**: Bull burners are made of high quality stainless steel and are warranted for the life of the grill.
* **Solid Stainless Steel Grates**: The heavy duty grates are designed to retain heat and produce professional sear marks.
* **Dual Lined Hood**: The seamless welded hood is double lined to lock in heat and prevent discoloration.
        `,
        features: [
            "Heavy Duty 304 Stainless Steel Construction",
            "ReliaBull Heat Technology",
            "Dual Lined Hood",
            "Piezo Igniters on every valve",
            "Warming Rack"
        ],
        specifications: {
            "BTUs": "60,000",
            "Cooking Surface": "810 sq. in.",
            "Burners": "4 Cast Stainless Steel",
            "Construction": "304 Stainless Steel",
            "Warranty": "Lifetime on Fire Box and Grates"
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        downloads: [
            { title: "Spec Sheet", url: "#" },
            { title: "Installation Guide", url: "#" }
        ]
    }
};
