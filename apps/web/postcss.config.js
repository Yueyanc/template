import tailwindConfig from "./tailwind.config";
console.log(11111, tailwindConfig);
export default {
  plugins: {
    tailwindcss: tailwindConfig,
    autoprefixer: {},
  },
};
