import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "../index.html"),
    path.join(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
