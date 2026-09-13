// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.VERCEL ? "vercel" : undefined,
    // @ts-expect-error vercel configuration forwarded to Nitro
    vercel: {
      functions: {
        runtime: "nodejs22.x",
      },
    },
  },
  vite: {
    define: {
      "import.meta.env.VITE_GROQ_API_KEY": JSON.stringify(
        process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || ""
      ),
      "import.meta.env.GROQ_API_KEY": JSON.stringify(
        process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || ""
      ),
    },
  },
});


