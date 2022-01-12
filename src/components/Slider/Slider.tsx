import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { Children, createRef, useEffect, useState } from "react";

/* TODOS:
  - adding grabbing effect for desktop
  - when releasing go to the nearest item
  - buttons
  - needs to work with different setting (scroll, showNumbers)
  - inifinite scroll
  - dots
*/

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    overflow: "scroll",
    //Hiding the scrollbar but keeps functionality
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    cursor: "grab",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  grabbing: {
    cursor: "grabbing",
  },
  list: {
    whiteSpace: "nowrap",
    flexFlow: "row",
  },
  listItem: {
    display: "inline-flex",
    "&:nth-child(0)": {
      width: "100%",
    },
  },
}));

interface ISliderSettings {
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  draggable?: boolean;
  gap?: string;
  //TODO add functions here
}

type Props = ISliderSettings;

const Slider: React.FC<Props> = ({
  dots = false,
  infinite = false,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  draggable = true,
  gap,
  children,
}) => {
  const classes = useStyles();
  const wrapperRef = createRef<HTMLDivElement>();
  const [numbOfSlides, setNumbOfSlides] = useState<number>(
    Children.toArray(children).length
  );
  const [wrapperWidth, setWrapperWidth] = useState<number>();
  const [grabbing, setGrabbing] = useState<boolean>(false);

  useEffect(() => {
    setWrapperWidth(wrapperRef.current?.offsetWidth);
  }, [wrapperRef]);

  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    currentWrapper?.addEventListener("mousedown", () => setGrabbing(true));
    currentWrapper?.addEventListener("mouseup", () => setGrabbing(false));
    window.addEventListener("resize", () =>
      setWrapperWidth(currentWrapper?.offsetWidth)
    );

    return () => {
      currentWrapper?.removeEventListener("mousedown", () => setGrabbing(true));
      currentWrapper?.removeEventListener("mouseup", () => setGrabbing(false));
      window.removeEventListener("resize", () =>
        setWrapperWidth(currentWrapper?.offsetWidth)
      );
    };
  });

  console.log("children", Children.toArray(children).length);

  return (
    <div
      className={clsx(classes.root, grabbing && classes.grabbing)}
      ref={wrapperRef}
    >
      <div className={classes.list}>
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return (
              <div
                style={{
                  width: wrapperWidth ? wrapperWidth / slidesToShow : 0,
                }}
                className={classes.listItem}
              >
                {React.cloneElement(child, {
                  style: { ...child.props.style, width: "100%" },
                })}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Slider;
