import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // entities/user используется ещё и через @x из entities/session,
    // но insignificant-slice такие ссылки не учитывает.
    files: ["./src/entities/user", "./src/entities/user/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
