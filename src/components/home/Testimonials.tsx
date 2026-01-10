import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    text: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Carlos Mendez",
        text: "Just wanted to say thank you to JC and the team at Evening Delights. During this pandemic time things got delayed some but they kept me updated throughout the process…",
        rating: 5,
    },
    {
        id: 2,
        name: "Richard Wong",
        text: "This is a big toy store for people who loves cooking outdoors. I was in the market for a new grill and Jeff helped me find one that fit my budget. Very knowledgeable on the products…",
        rating: 5,
    },
    {
        id: 3,
        name: "Roberto Miki",
        text: "The staff are very helpful and knowledgeable especially about grills. The store has plenty of selection from top of the line to more affordable models. Lots of accessories sold as well…",
        rating: 5,
    },
    {
        id: 4,
        name: "Larry",
        text: "First time coming in the store. Jeff was real friendly and knowledgeable about inventory. Even gave me a few tips for a Thanksgiving recipe. I recommend anyone that likes grilling...",
        rating: 5,
    },
    {
        id: 5,
        name: "Javier Ortiz",
        text: "JC was the man! Explained everything extremely well and helped me get the grill I was looking for. Would highly recommend to anyone looking for a Traeger.",
        rating: 5,
    }
];

export function Testimonials() {
    return (
        <section className="w-full py-12 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">See What Our Clients Are Saying</h2>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial) => (
                            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex flex-col items-start p-6 h-64 justify-between">
                                            <div className="space-y-2">
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                                    ))}
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-4">"{testimonial.text}"</p>
                                            </div>
                                            <div className="font-semibold text-sm mt-4">
                                                - {testimonial.name}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
}
