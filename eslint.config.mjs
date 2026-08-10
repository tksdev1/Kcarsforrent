import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * ESLint 9 flat config. `next lint` is deprecated and was never configured
 * here, so `npm run lint` dropped into an interactive setup prompt instead of
 * checking anything.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      ".netlify/**",
      ".data/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
