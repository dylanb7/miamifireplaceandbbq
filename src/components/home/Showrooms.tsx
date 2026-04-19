import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";
import { BRAND_EMAIL } from "@/data/brand-info";

export function Showrooms() {
    return (
        <section id="showrooms" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Visit Our Showroom</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Experience our products in person at our Miami showroom. Our experts are ready to help you design your dream outdoor space.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Card */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm border space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <MapPin className="text-primary h-5 w-5" /> Miami Location
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p className="text-lg text-foreground font-medium">Miami Fireplace & BBQ</p>
                                <p>9621 S Dixie Hwy</p>
                                <p>Miami, FL 33156</p>
                                <div className="pt-2">
                                    <Button className="w-full sm:w-auto" asChild>
                                        <a href="https://www.google.com/maps/dir/?api=1&destination=9621+S+Dixie+Hwy,+Miami,+FL+33156" target="_blank" rel="noopener noreferrer">
                                            Get Directions
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="text-primary h-4 w-4" /> Contact
                                </h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p><a href="tel:+13056663312" className="hover:text-primary transition-colors">(305) 666-3312</a></p>
                                    <p><a href={`mailto:${BRAND_EMAIL}`} className="hover:text-primary transition-colors">{BRAND_EMAIL}</a></p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="text-primary h-4 w-4" /> Hours
                                </h3>
                                <div className="space-y-2 text-muted-foreground text-sm">
                                    <div className="flex justify-between">
                                        <span>Mon - Sat</span>
                                        <span className="font-medium text-foreground">10:00 AM - 6:00 PM</span>
                                    </div>


                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-medium text-foreground">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder / Image */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm border space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <MapPin className="text-primary h-5 w-5" /> Davie Location
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p className="text-lg text-foreground font-medium">Miami Fireplace & BBQ</p>
                                <p>7080 W State Rd 84</p>
                                <p>Davie, FL 33317</p>
                                <div className="pt-2">
                                    <Button className="w-full sm:w-auto" asChild>
                                        <a href="https://www.google.com/maps/dir/?api=1&destination=7080+W+State+Rd+84+Davie,+FL+33317" target="_blank" rel="noopener noreferrer">
                                            Get Directions
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="text-primary h-4 w-4" /> Contact
                                </h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p><a href="tel:+19549150212" className="hover:text-primary transition-colors">(954) 915-0212</a></p>
                                    <p><a href={`mailto:${BRAND_EMAIL}`} className="hover:text-primary transition-colors">{BRAND_EMAIL}</a></p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="text-primary h-4 w-4" /> Hours
                                </h3>
                                <div className="space-y-2 text-muted-foreground text-sm">
                                    <div className="flex justify-between">
                                        <span>Mon - Fri</span>
                                        <span className="font-medium text-foreground">10:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-medium text-foreground">10:00 AM - 5:00 PM</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-medium text-foreground">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
