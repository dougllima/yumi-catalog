import { describe, expect, it } from "vitest";

import { defaultProductImageCrop } from "@/domain/product";
import {
  cropWindow,
  dragCrop,
  visibleFractions,
} from "@/utils/productImageCropGeometry";

describe("product image crop geometry", () => {
  it.each([
    [1, 1, 1],
    [2, 0.5, 1],
    [0.5, 1, 0.5],
  ])(
    "computes visible fractions for an aspect ratio of %s",
    (aspect, width, height) => {
      expect(visibleFractions(defaultProductImageCrop, aspect)).toEqual({
        width,
        height,
      });
      expect(
        visibleFractions({ ...defaultProductImageCrop, zoom: 3 }, aspect),
      ).toEqual({
        width: width / 3,
        height: height / 3,
      });
    },
  );

  it.each([1, 2, 0.5])(
    "aligns the crop window to either edge at aspect ratio %s",
    (aspect) => {
      const leftTop = cropWindow({ xPercent: 0, yPercent: 0, zoom: 3 }, aspect);
      const rightBottom = cropWindow(
        { xPercent: 100, yPercent: 100, zoom: 3 },
        aspect,
      );

      expect(leftTop).toMatchObject({ x: 0, y: 0 });
      expect(rightBottom.x + rightBottom.width).toBeCloseTo(1);
      expect(rightBottom.y + rightBottom.height).toBeCloseTo(1);
    },
  );

  it.each([
    [1, 50, 50],
    [2, 40, 50],
    [0.5, 50, 40],
  ])(
    "locks axes with no area to pan at aspect ratio %s",
    (aspect, xPercent, yPercent) => {
      expect(
        dragCrop(defaultProductImageCrop, { x: 20, y: 20 }, 200, aspect),
      ).toEqual({
        xPercent,
        yPercent,
        zoom: 1,
      });
    },
  );

  it("reverses a drag away from the limits", () => {
    const crop = { xPercent: 60, yPercent: 40, zoom: 3 };
    const moved = dragCrop(crop, { x: 45, y: -30 }, 300, 0.5);
    expect(moved.xPercent).toBeCloseTo(52.5);
    expect(moved.yPercent).toBeCloseTo(42);
    const restored = dragCrop(moved, { x: -45, y: 30 }, 300, 0.5);
    expect(restored.xPercent).toBeCloseTo(crop.xPercent);
    expect(restored.yPercent).toBeCloseTo(crop.yPercent);
    expect(restored.zoom).toBe(3);
  });

  it("clamps a drag to the edges", () => {
    expect(
      dragCrop(
        { ...defaultProductImageCrop, zoom: 2 },
        { x: 500, y: -500 },
        200,
        1,
      ),
    ).toEqual({
      xPercent: 0,
      yPercent: 100,
      zoom: 2,
    });
  });
});
