/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        blue:{
          700:"#146eb4",
          701:"#146eb4",
          702:"#0f4e82"
        },
        sidebar:{
          50:"#1E2640"
        },
        gray:{
          500:"#e6e6ea",
          900:"#e6e6ea"
        }
      }
    },
  },
  plugins: [],
}