// vitest.config.ts
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { mergeConfig, defineConfig as defineConfig2, configDefaults } from "file:///C:/xampp/htdocs/kapak/node_modules/vitest/dist/config.js";

// vite.config.ts
import { fileURLToPath, URL as URL2 } from "node:url";
import { defineConfig, loadEnv } from "file:///C:/xampp/htdocs/kapak/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/xampp/htdocs/kapak/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/xampp/htdocs/kapak/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///C:/xampp/htdocs/kapak/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/xampp/htdocs/kapak/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  process.env = loadEnv(mode, process.cwd());
  const prox = {
    target: process.env.VITE_API_URL,
    changeOrigin: true,
    secure: false,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
  return {
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL2("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      proxy: {
        // auth
        "/api/auth/auto_login": prox,
        "/api/auth/login": prox,
        "/api/auth/create_user": prox,
        "/api/auth/logout": prox,
        "/api/auth/delete_user": prox,
        // oauth2
        "/api/oauth2/facebook": prox,
        "/api/oauth2/google": prox,
        // item
        "/api/item/banners": prox,
        "/api/item/provider_prefixes": prox,
        "/api/item/top_up_nominal": prox,
        // email
        "/api/email/send_verification": prox,
        "/api/email/check_code": prox,
        "/api/email/check_email": prox
      }
    }
  };
});

// vitest.config.ts
var __vite_injected_original_import_meta_url2 = "file:///C:/xampp/htdocs/kapak/vitest.config.ts";
var vitest_config_default = mergeConfig(
  vite_config_default,
  defineConfig2({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath2(new URL("./", __vite_injected_original_import_meta_url2))
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxrYXBha1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXGthcGFrXFxcXHZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3hhbXBwL2h0ZG9jcy9rYXBhay92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHsgbWVyZ2VDb25maWcsIGRlZmluZUNvbmZpZywgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHZpdGVDb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcoXG4gIHZpdGVDb25maWcsXG4gIGRlZmluZUNvbmZpZyh7XG4gICAgdGVzdDoge1xuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgICBleGNsdWRlOiBbLi4uY29uZmlnRGVmYXVsdHMuZXhjbHVkZSwgJ2UyZS8qKiddLFxuICAgICAgcm9vdDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0pLFxuKVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxca2FwYWtcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxrYXBha1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzoveGFtcHAvaHRkb2NzL2thcGFrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBwcm9jZXNzLmVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcbiAgY29uc3QgcHJveCA9IHtcbiAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCxcbiAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgc2VjdXJlOiBmYWxzZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgIH0sXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFt2dWUoKSwgdnVlSnN4KCksIHZ1ZURldlRvb2xzKCldLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gYXV0aFxuICAgICAgICAnL2FwaS9hdXRoL2F1dG9fbG9naW4nOiBwcm94LFxuICAgICAgICAnL2FwaS9hdXRoL2xvZ2luJzogcHJveCxcbiAgICAgICAgJy9hcGkvYXV0aC9jcmVhdGVfdXNlcic6IHByb3gsXG4gICAgICAgICcvYXBpL2F1dGgvbG9nb3V0JzogcHJveCxcbiAgICAgICAgJy9hcGkvYXV0aC9kZWxldGVfdXNlcic6IHByb3gsXG5cbiAgICAgICAgLy8gb2F1dGgyXG4gICAgICAgICcvYXBpL29hdXRoMi9mYWNlYm9vayc6IHByb3gsXG4gICAgICAgICcvYXBpL29hdXRoMi9nb29nbGUnOiBwcm94LFxuXG4gICAgICAgIC8vIGl0ZW1cbiAgICAgICAgJy9hcGkvaXRlbS9iYW5uZXJzJzogcHJveCxcbiAgICAgICAgJy9hcGkvaXRlbS9wcm92aWRlcl9wcmVmaXhlcyc6IHByb3gsXG4gICAgICAgICcvYXBpL2l0ZW0vdG9wX3VwX25vbWluYWwnOiBwcm94LFxuXG4gICAgICAgIC8vIGVtYWlsXG4gICAgICAgICcvYXBpL2VtYWlsL3NlbmRfdmVyaWZpY2F0aW9uJzogcHJveCxcbiAgICAgICAgJy9hcGkvZW1haWwvY2hlY2tfY29kZSc6IHByb3gsXG4gICAgICAgICcvYXBpL2VtYWlsL2NoZWNrX2VtYWlsJzogcHJveCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsU0FBUyxpQkFBQUEsc0JBQXFCO0FBQzNSLFNBQVMsYUFBYSxnQkFBQUMsZUFBYyxzQkFBc0I7OztBQ0QrTCxTQUFTLGVBQWUsT0FBQUMsWUFBVztBQUU1UixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8saUJBQWlCO0FBTGlJLElBQU0sMkNBQTJDO0FBUTFNLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFVBQVEsTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFDekMsUUFBTSxPQUFPO0FBQUEsSUFDWCxRQUFRLFFBQVEsSUFBSTtBQUFBLElBQ3BCLGNBQWM7QUFBQSxJQUNkLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxNQUNQLCtCQUErQjtBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUFBLElBQ3hDLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJQyxLQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsUUFFTCx3QkFBd0I7QUFBQSxRQUN4QixtQkFBbUI7QUFBQSxRQUNuQix5QkFBeUI7QUFBQSxRQUN6QixvQkFBb0I7QUFBQSxRQUNwQix5QkFBeUI7QUFBQTtBQUFBLFFBR3pCLHdCQUF3QjtBQUFBLFFBQ3hCLHNCQUFzQjtBQUFBO0FBQUEsUUFHdEIscUJBQXFCO0FBQUEsUUFDckIsK0JBQStCO0FBQUEsUUFDL0IsNEJBQTRCO0FBQUE7QUFBQSxRQUc1QixnQ0FBZ0M7QUFBQSxRQUNoQyx5QkFBeUI7QUFBQSxRQUN6QiwwQkFBMEI7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzs7O0FEbkQwSixJQUFNQyw0Q0FBMkM7QUFJNU0sSUFBTyx3QkFBUTtBQUFBLEVBQ2I7QUFBQSxFQUNBQyxjQUFhO0FBQUEsSUFDWCxNQUFNO0FBQUEsTUFDSixhQUFhO0FBQUEsTUFDYixTQUFTLENBQUMsR0FBRyxlQUFlLFNBQVMsUUFBUTtBQUFBLE1BQzdDLE1BQU1DLGVBQWMsSUFBSSxJQUFJLE1BQU1GLHlDQUFlLENBQUM7QUFBQSxJQUNwRDtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogWyJmaWxlVVJMVG9QYXRoIiwgImRlZmluZUNvbmZpZyIsICJVUkwiLCAiVVJMIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiZGVmaW5lQ29uZmlnIiwgImZpbGVVUkxUb1BhdGgiXQp9Cg==
