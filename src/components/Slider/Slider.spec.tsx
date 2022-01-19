import { render, screen } from "@testing-library/react";
import React from "react";
import Slider, { sliderTestIds } from "./Slider";

describe("Slider", () => {
  describe("Slider element children", () => {
    it("should display number of children", () => {
      render(
        <Slider>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </Slider>
      );
      expect(screen.queryAllByTestId(sliderTestIds.slide).length).toBe(3);
    });
    it("empty input, empty output", () => {
      const { container } = render(<Slider>{/* <></> */}</Slider>);
      expect(container.innerHTML).toBe("");
    });
  });

  describe("inputValues", () => {
    describe("speed", () => {
      const speed = 200;
      it(`speed is ${speed}ms`, () => {
        render(
          <Slider speed={speed}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        expect(screen.getByTestId(sliderTestIds.list)).toHaveStyle(
          `transition: transform ${speed}ms ease;`
        );
      });
      it("no speed set", () => {
        render(
          <Slider>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        expect(screen.getByTestId(sliderTestIds.list)).toHaveStyle(
          "transition: transform 500ms ease;"
        );
      });
    });
    describe("slidesToShow", () => {
      it("displays 1 slide without props input", () => {
        render(
          <Slider>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        expect(screen.queryAllByTestId(sliderTestIds.slide)[0]).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });
      it(`displays correct number of slides`, () => {
        const slidesToShow = 3;
        render(
          <Slider slidesToShow={[slidesToShow]}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        const slides = screen.queryAllByTestId(sliderTestIds.slide);

        slides
          .slice(0, slidesToShow)
          .map((slide) =>
            expect(slide).toHaveAttribute("aria-hidden", "false")
          );
      });
    });
    describe("draggable", () => {
      it("default true", () => {
        render(
          <Slider>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        expect(screen.getByTestId(sliderTestIds.list)).not.toHaveAttribute(
          "class",
          "makeStyles-list-38 makeStyles-nonDraggable-39"
        );
      });
      it("false", () => {
        render(
          <Slider draggable={false}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </Slider>
        );
        expect(screen.getByTestId(sliderTestIds.list)).toHaveAttribute(
          "class",
          "makeStyles-list-38 makeStyles-nonDraggable-39"
        );
      });
    });
  });
});
