import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前文件路径的辅助函数
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // TypeScript 配置
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: await import("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      // '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // TypeScript 特定规则
    },
  },

  // 路径解析配置
  {
    // 为导入解析器提供设置
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", path.resolve(__dirname, "src")],
            ["@/components", path.resolve(__dirname, "src/components")],
            ["@/utils", path.resolve(__dirname, "src/utils")],
            ["@/hooks", path.resolve(__dirname, "src/hooks")],
            ["@/types", path.resolve(__dirname, "src/types")],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
        // 也可以配置其他解析器，如 typescript
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
]);
