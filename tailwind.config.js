module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2.5s linear infinite',
      },
      colors: {
        dark: {
          dominant: {
            400: 'hsl(240, 22%, 24%)',
            500: 'hsl(240, 22%, 20%)',
            600: 'hsl(240, 21%, 16%)',
            700: 'hsl(240, 21%, 12%)',
            800: 'hsl(240, 22%, 8%)',
            900: 'hsl(240, 24%, 4%)',
          },
          secondary: 'hsl(0, 0%, 98%)',
          accent: {
            400: 'hsl(313, 57%, 44%)',
            500: 'hsl(313, 57%, 39%)',
            900: 'hsl(314, 57%, 7%)',
          },
          complementary: {
            400: 'hsl(204, 69%, 48%)',
            500: 'hsl(204, 69%, 43%)',
            900: 'hsl(204, 69%, 7%)',
          },
          valid: 'hsl(85, 68%, 40%)',
          error: {
            400: 'hsl(354, 72%, 50%)',
            500: 'hsl(354, 72%, 40%)',
          },
          pending: 'hsl(201, 72%, 40%)',
        },
        light: {
          dominant: {
            400: 'hsl(240, 22%, 24%)',
            500: 'hsl(240, 22%, 20%)',
            600: 'hsl(240, 21%, 16%)',
            700: 'hsl(240, 21%, 12%)',
            800: 'hsl(240, 22%, 8%)',
            900: 'hsl(240, 24%, 4%)',
          },
          secondary: 'hsl(0, 0%, 2%)',
          accent: {
            400: 'hsl(313, 57%, 44%)',
            500: 'hsl(313, 57%, 39%)',
          },
          complementary: {
            500: 'hsl(201, 72%, 40%)',
          },
          valid: 'hsl(85, 72%, 40%)',
          error: 'hsl(354, 72%, 40%)',
          pending: 'hsl(201, 72%, 40%)',
        },
      },
    },
  },
  plugins: [],
};
