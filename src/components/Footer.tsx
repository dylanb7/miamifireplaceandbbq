import { ContactUs } from "./contact-us";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "./Logo";

import { interestOptions, productOptions } from "@/data/contact-options";

interface FooterProps {
    showContactForm?: boolean;
}

export function Footer({ showContactForm = true }: FooterProps) {
    return (
        <footer className="bg-base-200 text-base-content border-t border-base-300 mt-auto">
            <div className="container mx-auto py-12 px-4">
                <div className={`grid grid-cols-1 ${showContactForm ? 'lg:grid-cols-3' : 'lg:grid-cols-2 justify-center'} gap-12`}>
                    <div className={`${showContactForm ? 'lg:col-span-2' : 'lg:col-span-2'} grid md:grid-cols-2 gap-8`}>
                        <div className="md:col-span-2 mb-4">
                            <Logo variant="sheet" />

                            <p className="text-muted-foreground mt-4 max-w-prose">
                                Experience our premium collection of outdoor kitchens and grills in person.
                                Our experts are here to help you design your perfect backyard oasis.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                <a
                                    href="https://maps.google.com/?q=9621+S+Dixie+Hwy,+Miami,+FL+33156"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <MapPin className="text-primary" size={20} />
                                    Miami Showroom
                                </a>
                            </h3>
                            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
                                <a
                                    href="https://maps.google.com/?q=9621+S+Dixie+Hwy,+Miami,+FL+33156"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors block"
                                >
                                    <address className="not-italic leading-relaxed">
                                        9621 S Dixie Hwy<br />
                                        Miami, FL 33156
                                    </address>
                                </a>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Mon-Sat 10:00 AM - 6:00 PM</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone size={14} />
                                    <a href="tel:+13056663312" className="hover:text-primary transition-colors">(305) 666-3312</a>
                                </div>

                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                <a
                                    href="https://maps.google.com/?q=7080+W+State+Rd+84,+Davie,+FL+33317"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <MapPin className="text-primary" size={20} />
                                    Davie Showroom
                                </a>
                            </h3>
                            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
                                <a
                                    href="https://maps.google.com/?q=7080+W+State+Rd+84,+Davie,+FL+33317"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors block"
                                >
                                    <address className="not-italic leading-relaxed">
                                        7080 W State Rd 84<br />
                                        Davie, FL 33317
                                    </address>
                                </a>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Mon - Fri 10:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Saturday 10:00 AM - 5:00 PM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} />
                                    <a href="tel:+19549150212" className="hover:text-primary transition-colors">(954) 915-0212</a>
                                </div>

                            </div>
                        </div>
                    </div>

                    {showContactForm && (
                        <div className="lg:col-span-1">
                            <div className="card bg-base-100 shadow-sm border border-base-300 p-1">
                                <ContactUs
                                    interestOptions={interestOptions}
                                    productOptions={productOptions}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Miami Fireplace & BBQ. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition-colors">
                            <Facebook size={20} />
                            <span className="sr-only">Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/miami_fireplaces_and_bbq" className="hover:text-primary transition-colors">
                            <Instagram size={20} />
                            <span className="sr-only">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
