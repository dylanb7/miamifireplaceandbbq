import React from "react";
import { Footer } from "./Footer";

import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

const PageLayout: React.FC<{ children: React.ReactNode, hideFooterContact?: boolean, noPadding?: boolean }> = ({ children, hideFooterContact = false, noPadding = false }) => {
    const [visible, setVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    // Handle Scroll for Header Hide
    React.useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== "undefined") {
                const currentScrollY = window.scrollY;

                // Hide/Show logic
                if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                    setVisible(false);
                } else {
                    setVisible(true);
                }
                lastScrollY.current = currentScrollY;
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-svh w-full bg-background font-sans antialiased">
            <DesktopHeader visible={visible} />
            <MobileHeader visible={visible} />

            <main className={`flex-1 w-full max-w-[100vw] ${noPadding ? "" : "pt-32 md:pt-36"}`}>
                {children}
            </main>

            <Footer showContactForm={!hideFooterContact} />

        </div>
    );
};

export default PageLayout;