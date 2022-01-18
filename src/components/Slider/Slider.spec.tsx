import { render } from "@testing-library/react";
import React from "react";
import Slider from "./Slider";

describe("Slider element", () => {
  it("should display number of children", () => {
    const { container } = render(
      <Slider>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </Slider>
    );

    /* console.log("count", container); */
  });
});

describe("Functions", () => {});
