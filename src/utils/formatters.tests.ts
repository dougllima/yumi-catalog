import { describe, expect, it } from "vitest";

import { formatCurrency } from "@/utils/formatters";

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ");

describe("formatCurrency", () => {
  it("formats values in Brazilian reais", () => {
    expect(normalizeSpaces(formatCurrency(19.9))).toBe("R$ 19,90");
    expect(normalizeSpaces(formatCurrency(130))).toBe("R$ 130,00");
  });
});
