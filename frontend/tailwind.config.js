export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { light: '#3b82f6', DEFAULT: '#2563eb', dark: '#1d4ed8' },
        secondary: { light: '#10b981', DEFAULT: '#059669', dark: '#047857' }
      }
    },
  },
  plugins: [],
}
