import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { Children, createRef, useEffect, useState } from "react";

/* TODOS:
  - inifinite scroll
  - export the click functions
  - wcag
  - export functions
  - rubberband effect
*/

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    direction: "ltr",
    position: "relative",
    overflowX: "hidden",
    width: "100%",
    cursor: "grab",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  grabbing: {
    cursor: "grabbing",
  },
  nonDraggable: {
    cursor: "auto",
  },
  list: {
    whiteSpace: "nowrap",
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
}

type Props = ISliderSettings;

const Slider: React.FC<Props> = ({
  dots = false,
  infinite = false,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  draggable = true,
  children,
}) => {
  const classes = useStyles();
  const wrapperRef = createRef<HTMLDivElement>();
  const listRef = createRef<HTMLDivElement>();
  const numbOfSlides = Children.toArray(children).length;
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [currentXPosition, setCurrentXPosition] = useState<number>(-0);
  const [previousXPosition, setPreviousXPosition] = useState<number>(-0);
  const step = 100 / (numbOfSlides / slidesToScroll);
  const maxStep = -100 + 100 / (numbOfSlides / slidesToShow);
  const [touchDown, setTouchDown] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(speed);
  const currentStep = 1 - currentXPosition / step; //TODO do something with this

  useEffect(() => {
    if (wrapperRef.current?.offsetWidth) {
      setWrapperWidth(wrapperRef.current?.offsetWidth);
    }
  }, [wrapperRef]);

  const goToNext = () => {
    setCurrentXPosition(
      currentXPosition - step < maxStep ? maxStep : currentXPosition - step
    );
    setPreviousXPosition(
      currentXPosition - step < maxStep ? maxStep : currentXPosition - step
    );
  };
  const goToPrevious = () => {
    setCurrentXPosition(
      currentXPosition + step > 0 ? 0 : currentXPosition + step
    );
    setPreviousXPosition(
      currentXPosition + step > 0 ? 0 : currentXPosition + step
    );
  };

  const onDrag = (position: number, previousPosition: number) => {
    if (!grabbing) {
      return;
    }
    const listWidth = listRef.current?.offsetWidth;
    setCurrentSpeed(0);
    setTouchDown(position);
    setCurrentXPosition(
      currentXPosition -
        ((previousPosition - position) / (listWidth || 1)) * 100
    );
  };

  const stoppedMoving = () => {
    setGrabbing(false);
    setCurrentSpeed(speed);
    const percentageOfChange = 25;

    const shouldChange =
      (Math.abs(previousXPosition - currentXPosition) / step) * 100 >=
      percentageOfChange;
    const previous = previousXPosition - currentXPosition < 0;

    const newValue = shouldChange
      ? previous
        ? previousXPosition + step
        : previousXPosition - step
      : previousXPosition;

    if (newValue > 0) {
      setCurrentXPosition(0);
      setPreviousXPosition(0);
    } else if (newValue < maxStep) {
      setCurrentXPosition(maxStep);
      setPreviousXPosition(maxStep);
    } else {
      setCurrentXPosition(newValue);
      setPreviousXPosition(newValue);
    }
  };

  const startDragging = (position: number) => {
    setGrabbing(true);
    setTouchDown(position);
  };

  const goToSlide = (index: number) => {
    const newXValue = -(100 / numbOfSlides) * index;
    if (newXValue < maxStep) {
      setCurrentXPosition(maxStep);
    } else {
      setCurrentXPosition(-(100 / numbOfSlides) * index);
    }
  };

  useEffect(() => {
    const currentWrapper = listRef.current;
    window.addEventListener("resize", () => {
      if (currentWrapper?.offsetWidth) {
        setWrapperWidth(currentWrapper?.offsetWidth);
      }
    });
    return () => {
      window.removeEventListener("resize", () => {
        if (currentWrapper?.offsetWidth) {
          setWrapperWidth(currentWrapper?.offsetWidth);
        }
      });
    };
  }, []);

  return (
    <>
      <div className={classes.root} ref={wrapperRef}>
        <div
          ref={listRef}
          className={clsx(
            classes.list,
            grabbing && classes.grabbing,
            !draggable && classes.nonDraggable
          )}
          onTouchStart={
            draggable
              ? (e: React.TouchEvent) =>
                  startDragging(e.changedTouches[0].clientX)
              : undefined
          }
          onTouchEnd={draggable ? () => stoppedMoving() : undefined}
          onTouchMove={
            draggable
              ? (e: React.TouchEvent) =>
                  onDrag(e.changedTouches[0].clientX, touchDown)
              : undefined
          }
          onMouseDown={
            draggable
              ? (e: React.MouseEvent) => startDragging(e.clientX)
              : undefined
          }
          onMouseUp={draggable ? () => stoppedMoving() : undefined}
          onMouseMove={
            draggable ? (e) => onDrag(e.clientX, touchDown) : undefined
          }
          onMouseOut={draggable ? () => stoppedMoving() : undefined}
          style={{
            transition: `transform ${currentSpeed}ms ease`,
            transform: `translateX(${currentXPosition}%)`,
          }}
        >
          {Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return (
                <div
                  style={{
                    width: wrapperWidth / slidesToShow,
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

      {/* TODO only export these functions */}
      {dots && (
        <div className="dots">
          {new Array(numbOfSlides).fill(1).map((value, key) => {
            return (
              <button key={key} onClick={() => goToSlide(key)}>
                {key}
              </button>
            );
          })}
        </div>
      )}

      <div>
        <button onClick={goToPrevious}>Prev</button>
        <button onClick={goToNext}>Next</button>
      </div>
    </>
  );
};

export default Slider;
