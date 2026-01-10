
interface SeoProps {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    keywords?: string;
}

export function generateSeo({ title, description, image, type = 'website', keywords }: SeoProps) {
    const meta = [
        { title },
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: type },
    ];

    if (image) {
        meta.push({ property: 'og:image', content: image });
        meta.push({ name: 'twitter:image', content: image });
    }

    if (keywords) {
        meta.push({ name: 'keywords', content: keywords });
    }

    // Twitter Card
    meta.push({ name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });
    meta.push({ name: 'twitter:title', content: title });
    meta.push({ name: 'twitter:description', content: description });

    return { meta };
}
