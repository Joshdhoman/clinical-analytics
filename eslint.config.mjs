import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Streamlit dashboard is a Python project sharing this repo. Its
    // virtualenv contains Streamlit's bundled frontend JS, which ESLint will
    // otherwise try to parse (and run out of memory doing so).
    "dashboard/**",
  ]),
]);

export default eslintConfig;
