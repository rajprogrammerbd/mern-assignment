import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ZukMe',
        short_name: 'ZukMe',
        description: 'Where Fashion Meets Opportunity',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/images/zukme-icon.png',
                sizes: 'any',
                type: 'image/x-icon'
            }
        ]
    };
}
