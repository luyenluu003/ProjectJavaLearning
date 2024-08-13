/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary:"#2B85FF",
      secondary:"#EF863E",
      white: "#FFFFFF",
      black: "#242424",
      grey: "#F3F3F3",
      "dark-grey": "#6B6B6B",
      red: "#FF4E4E",
      transparent: "transparent",
      twitter: "#1DA1F2",
      purple: "#8B46FF",
      gray: "#1E1C2A",
      "gray-dark": "#403D51",
      "blue-gwen": "#2D6691",
      "colorcard":"#252836",
    },

    

    extend: {
      backgroundColor: {
        "gray-900": "#1E1C2A",
        "gray-dark": "#403D51",
        "blue-800": "#2D6691 ",
        "color-card":"#252836",
      },
      backgroundImage: {
        // 'custom-pattern': "url('https://miusic-blog.s3.ap-southeast-1.amazonaws.com/ne1X-HrZ_38p_NJ5opTwc-1713433698385.jpeg')",
      },
    },
  },
  plugins: [
    
  ],
};
