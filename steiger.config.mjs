import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Слой страниц называется views (src/pages конфликтует с Next.js) и steiger его не анализирует.
    // Поэтому ссылки из views не учитываются, и правило помечает используемые слайсы как лишние.
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
