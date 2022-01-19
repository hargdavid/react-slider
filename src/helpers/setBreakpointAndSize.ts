import { setArrayValue } from "./setArrayValue";
import { BREAKPOINTS } from "./breakpoints.enum";

/* Setting number of visible slides and scroll for different screenSizes */
export const setBreakpointAndSize = (
  screenSize: number,
  slidesToScroll: number[],
  slidesToShow: number[]
): { newSlidesToScroll: number; newSlidesToShow: number } => {
  let newSlidesToScroll: number = slidesToScroll[0];
  let newSlidesToShow: number = slidesToShow[0];

  if (screenSize <= BREAKPOINTS.sm) {
    newSlidesToScroll = setArrayValue(0, slidesToScroll);
    newSlidesToShow = setArrayValue(0, slidesToShow);
  } else if (screenSize > BREAKPOINTS.sm && screenSize < BREAKPOINTS.md) {
    newSlidesToScroll = setArrayValue(1, slidesToScroll);
    newSlidesToShow = setArrayValue(1, slidesToShow);
  } else if (screenSize > BREAKPOINTS.md && screenSize < BREAKPOINTS.lg) {
    newSlidesToScroll = setArrayValue(2, slidesToScroll);
    newSlidesToShow = setArrayValue(2, slidesToShow);
  } else {
    newSlidesToScroll = setArrayValue(3, slidesToScroll);
    newSlidesToShow = setArrayValue(3, slidesToShow);
  }
  return {
    newSlidesToScroll,
    newSlidesToShow,
  };
};
