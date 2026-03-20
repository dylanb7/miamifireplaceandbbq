import React, { Fragment, useState } from 'react';
import { Link } from "@tanstack/react-router";
import { Transition, Dialog, TransitionChild } from '@headlessui/react';
import { Phone, Facebook, Instagram, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { navigationStructure } from "@/data/navigation";

export const MobileHeader: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

    return (
        <header
            className={`md:hidden fixed top-0 z-40 w-full transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
        >
            {/* Top Contact Bar */}
            <div className="bg-neutral text-neutral-content py-2 px-4 text-xs font-medium tracking-wide flex justify-center border-b border-primary-foreground/10">
                <a href="tel:3056663312" className="hover:text-primary-foreground transition-colors flex items-center gap-1 text-primary font-semibold">
                    <Phone size={12} /> Call Us: (305) 666-3312
                </a>
            </div>

            <nav className="bg-primary/95 backdrop-blur-md shadow-md border-b border-white/10 text-primary-foreground">
                <div className="container mx-auto flex items-center justify-between py-4 px-4 max-w-full">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                            <Logo />
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button
                        className="btn btn-square btn-ghost text-primary-foreground hover:bg-primary-foreground/20 hover:text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                        <span className="sr-only">Open Menu</span>
                    </button>
                </div>

                {/* Fullscreen Mobile Menu Overlay */}
                <Transition show={mobileMenuOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
                        <TransitionChild
                            as={Fragment}
                            enter="transition ease-out duration-300"
                            enterFrom="-translate-y-full opacity-0"
                            enterTo="translate-y-0 opacity-100"
                            leave="transition ease-in duration-200"
                            leaveFrom="translate-y-0 opacity-100"
                            leaveTo="-translate-y-full opacity-0"
                        >
                            <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <Logo variant="sheet" />
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-3 -mr-2 text-foreground hover:bg-accent rounded-md"
                                    >
                                        <X size={24} />
                                        <span className="sr-only">Close menu</span>
                                    </button>
                                </div>

                                {/* Scrollable Nav Links */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <ul className="flex flex-col gap-2">
                                        {navigationStructure.map((item) => (
                                            <li key={item.name} className="flex flex-col border-b border-border/40 pb-2 last:border-0">
                                                {item.subLinks ? (
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex items-center justify-between w-full">
                                                            <Link
                                                                to={item.path || '#'}
                                                                className="text-lg font-semibold tracking-tight py-3 flex-1 hover:text-primary transition-colors"
                                                                onClick={() => {
                                                                    if (item.path) setMobileMenuOpen(false);
                                                                }}
                                                                activeProps={{ className: "text-primary" }}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            <button
                                                                className="h-12 w-12 flex items-center justify-center active:bg-accent rounded-full hover:bg-accent/50 transition-colors -mr-2"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setMobileExpanded(prev => ({ ...prev, [item.name]: !prev[item.name] }));
                                                                }}
                                                            >
                                                                <div className={`transition-transform duration-300 ${mobileExpanded[item.name] ? "rotate-180" : ""}`}>
                                                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                                </div>
                                                            </button>
                                                        </div>

                                                        <div
                                                            className={`grid transition-all duration-300 ease-in-out ${mobileExpanded[item.name] ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"}`}
                                                        >
                                                            <ul className="overflow-hidden flex flex-col gap-1 pl-4 border-l-2 border-primary/20 ml-2">
                                                                {item.subLinks.map(sub => (
                                                                    <li key={sub.name}>
                                                                        <Link
                                                                            to={sub.path!}
                                                                            className="block py-3 text-base text-muted-foreground hover:text-foreground transition-colors"
                                                                            activeProps={{ className: "font-semibold text-primary" }}
                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                        >
                                                                            {sub.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={item.path!}
                                                        className="text-lg font-semibold tracking-tight py-3 hover:text-primary transition-colors"
                                                        activeProps={{ className: "text-primary" }}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Pinned Footer */}
                                <div className="p-6 border-t border-border bg-muted/20">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-center gap-6">
                                            <a href="tel:+13056663312" className="p-3 bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-full hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 group">
                                                <Phone size={24} className="group-hover:scale-110 transition-transform" />
                                                <span className="sr-only">Call Us</span>
                                            </a>
                                            <a href="#" className="p-3 bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-full hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 group">
                                                <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                                                <span className="sr-only">Facebook</span>
                                            </a>
                                            <a href="https://www.instagram.com/miami_fireplaces_and_bbq" className="p-3 bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-full hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 group">
                                                <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                                                <span className="sr-only">Instagram</span>
                                            </a>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <ModeToggle dropdownDirection="dropdown-top dropdown-end" />
                                            <span className="text-sm text-muted-foreground">Switch Theme</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionChild>
                    </Dialog>
                </Transition>
            </nav>
        </header>
    );
};
