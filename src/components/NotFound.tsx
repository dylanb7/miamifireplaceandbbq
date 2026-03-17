import { Link } from '@tanstack/react-router';
import { Flame, ArrowLeft, Search } from 'lucide-react';
import PageLayout from './PageLayout';
import { FeaturedCategories } from './home/FeaturedCategories';
import { Button } from './ui/button';

export function NotFound() {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <Flame className="w-32 h-32 md:w-48 md:h-48 text-primary animate-pulse relative z-10" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-foreground">
                    Looks like your fire went out.
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
                    We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the flame was just a mirage.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-24">
                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm border-2">
                        <Link to="/products/$type" params={{ type: "all" }}>
                            <Search className="mr-2 h-5 w-5" /> Explore Products
                        </Link>
                    </Button>
                </div>

                <div className="w-full h-px bg-border/50 mb-12" />

                <h2 className="text-2xl font-bold mb-4 text-left w-full pl-4 border-l-4 border-primary">Keep Browsing</h2>
            </div>

            {/* Native exploration fallback */}
            <div className="bg-muted/30">
                <FeaturedCategories />
            </div>
        </PageLayout>
    );
}
