import { describe, expect, it } from "vitest";

import { publicAssetUrl } from "@/utils/publicAssetUrl";

describe("publicAssetUrl", () => {
  it("keeps external URLs unchanged", () => {
    expect(publicAssetUrl("https://cdn.local/image.webp")).toBe(
      "https://cdn.local/image.webp",
    );
    expect(publicAssetUrl("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("prefixes public asset paths with the configured base URL", () => {
    expect(publicAssetUrl("/products/item.webp")).toBe("/products/item.webp");
    expect(publicAssetUrl("brand/yumi-logo.png")).toBe("/brand/yumi-logo.png");
  });
});
