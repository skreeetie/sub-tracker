import { describe, expect, it } from "vitest";
import { cn } from "@/shared/lib";

describe("cn", () => {
  it("склеивает классы через пробел", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("пропускает false, null, undefined и пустые строки", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });
});
