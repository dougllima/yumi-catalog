import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";

it("clips the styled image inside a square frame", () => {
  render(
    <ProductImageCropFrame
      src="/produto.png"
      alt="Produto"
      crop={{ xPercent: 15, yPercent: 75, zoom: 2 }}
      className="rounded-xl"
      imgClassName="select-none"
    />,
  );

  const image = screen.getByRole("img", { name: "Produto" });
  expect(image.parentElement).toHaveClass(
    "aspect-square",
    "self-start",
    "overflow-hidden",
    "rounded-xl",
  );
  expect(image).toHaveClass("size-full", "object-cover", "select-none");
  expect(image).toHaveStyle({
    objectPosition: "15% 75%",
    transform: "scale(2)",
    transformOrigin: "15% 75%",
  });
});
