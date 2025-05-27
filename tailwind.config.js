module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pack colors
        classic: {
          DEFAULT: '#F3C53F',
          light: '#F5D149',
          medium: '#E5B62B',
          dark: '#D8A615',
        },
        girls: {
          DEFAULT: '#E84D8A',
          light: '#F26CA0',
          medium: '#D43473',
          dark: '#B52860',
        },
        guys: {
          DEFAULT: '#A54429',
          light: '#C15F42',
          medium: '#8C3A22',
          dark: '#6E2F1B',
        },
        spicy: {
          DEFAULT: '#660000',
          light: '#802020',
          medium: '#4D0000',
          dark: '#330000',
        },
        couples: {
          DEFAULT: '#9C5BD1',
          light: '#B070E6',
          medium: '#8742BF',
          dark: '#7B34A8',
        },
        // App colors
        darkBg: '#0B0E1A',
        roseCTA: '#FF5A92',
        carouselBg: '#FDE0A4',
      },
    },
  },
  plugins: [],
}; 