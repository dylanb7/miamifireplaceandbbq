import { Button } from "@/components/ui/button";

export function FinancingSection() {
    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden bg-stone-900 text-white isolate">
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed' // Parallax effect
                }}
            />
            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-3xl border-l-4 border-primary pl-8 md:pl-12">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Dream Big. <br /> Pay Later.
                    </h2>
                    <p className="text-xl md:text-2xl text-stone-300 mb-8 leading-relaxed font-light">
                        Transform your home today with our flexible financing options.
                        Enjoy <span className="text-white font-semibold">0% interest</span> for up to 18 months on qualifying purchases.
                    </p>
                    <Button size="lg" variant="default" className="text-base px-8 h-12">
                        See Financing Options
                    </Button>
                </div>
            </div>
        </section>
    );
}
