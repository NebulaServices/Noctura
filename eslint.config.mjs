import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: ["dist/", "node_modules/", ".astro/", "docs/", "src/env.d.ts"]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.astro"],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ["src/**/*.astro", "src/**/*.astro/*.js", "src/**/*.astro/*.ts"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "no-undef": "off",
      "no-var": "off",
      "prefer-const": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-rest-params": "off"
    }
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.serviceworker
      }
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "prefer-rest-params": "off"
    }
  },
  {
    files: ["index.js", "astro.config.mjs", "eslint.config.mjs"],
    languageOptions: {
      globals: globals.node
    }
  }
];
