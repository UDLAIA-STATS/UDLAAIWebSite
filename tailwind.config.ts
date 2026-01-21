import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

module.exports =  {
    variants: {
        extend: {
            backgroundOpacity: ['active'],
        }
    }
}

export default config;