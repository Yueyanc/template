// apps/electron/vite.config.ts
import { join } from "node:path";
var __vite_injected_original_dirname = "D:\\code\\project\\template\\apps\\electron";
var PACKAGE_ROOT = __vite_injected_original_dirname;
var PROJECT_ROOT = join(PACKAGE_ROOT, "../..");
var config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      "/@/": `${join(PACKAGE_ROOT, "src")}/`
    }
  },
  build: {
    emptyOutDir: false,
    ssr: true,
    sourcemap: "inline",
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: {
        index: "src/index.ts"
      },
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].mjs"
      }
    },
    reportCompressedSize: false
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy9lbGVjdHJvbi92aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGNvZGVcXFxccHJvamVjdFxcXFx0ZW1wbGF0ZVxcXFxhcHBzXFxcXGVsZWN0cm9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHByb2plY3RcXFxcdGVtcGxhdGVcXFxcYXBwc1xcXFxlbGVjdHJvblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29kZS9wcm9qZWN0L3RlbXBsYXRlL2FwcHMvZWxlY3Ryb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBqb2luIH0gZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuY29uc3QgUEFDS0FHRV9ST09UID0gX19kaXJuYW1lO1xuY29uc3QgUFJPSkVDVF9ST09UID0gam9pbihQQUNLQUdFX1JPT1QsIFwiLi4vLi5cIik7XG5cbmNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyA9IHtcbiAgbW9kZTogcHJvY2Vzcy5lbnYuTU9ERSxcbiAgcm9vdDogUEFDS0FHRV9ST09ULFxuICBlbnZEaXI6IFBST0pFQ1RfUk9PVCxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIi9AL1wiOiBgJHtqb2luKFBBQ0tBR0VfUk9PVCwgXCJzcmNcIil9L2AsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgc3NyOiB0cnVlLFxuICAgIHNvdXJjZW1hcDogXCJpbmxpbmVcIixcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgIGFzc2V0c0RpcjogXCIuXCIsXG4gICAgbWluaWZ5OiBwcm9jZXNzLmVudi5NT0RFICE9PSBcImRldmVsb3BtZW50XCIsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeToge1xuICAgICAgICBpbmRleDogXCJzcmMvaW5kZXgudHNcIixcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0ubWpzXCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLFlBQVk7QUFBclUsSUFBTSxtQ0FBbUM7QUFHekMsSUFBTSxlQUFlO0FBQ3JCLElBQU0sZUFBZSxLQUFLLGNBQWMsT0FBTztBQUUvQyxJQUFNLFNBQXFCO0FBQUEsRUFDekIsTUFBTSxRQUFRLElBQUk7QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxPQUFPLEdBQUcsS0FBSyxjQUFjLEtBQUssQ0FBQztBQUFBLElBQ3JDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsUUFBUSxRQUFRLElBQUksU0FBUztBQUFBLElBQzdCLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHNCQUFzQjtBQUFBLEVBQ3hCO0FBQ0Y7QUFFQSxJQUFPLHNCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
