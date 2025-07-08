/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik-Regular', "sans-serif"],
        "rubik-bold": ['Rubik-Bold', "sans-serif"],
        "rubik-extrabold": ['Rubik-ExtraBold', "sans-serif"],
        "rubix-medium": ['Rubik-Medium', "sans-serif"],
        "rubix-semibold": ['Rubik-SemiBold', "sans-serif"],
        "rubix-light": ['Rubik-Light', "sans-serif"],
      }, 
    },
  },
  plugins: [],
}