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
        spicy: {
          DEFAULT: '#E35152',
          light: '#F16363',
          medium: '#CC3A3A',
          dark: '#B62C2C',
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
      },
    },
  },
  plugins: [],
}; 