import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, {
  Children,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    direction: "ltr",
    position: "relative",
    overflowX: "hidden",
    width: "100%",
    cursor: "grab",
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
  },
}));

export interface ISliderSettings {
  speed?: number;
  slidesToShow?: number[];
  slidesToScroll?: number[];
  draggable?: boolean;
  children: React.ReactChild[];
}

enum BREAKPOINTS {
  sm = 600,
  md = 900,
  lg = 1200,
  xl = 1536,
}

type Props = ISliderSettings & React.RefAttributes<unknown>;

const Slider: React.ForwardRefExoticComponent<Props> = forwardRef(
  (props: ISliderSettings, ref) => {
    const {
      speed = 500,
      slidesToShow = [1],
      slidesToScroll = [1],
      draggable = true,
      children,
    } = props;
    const classes = useStyles();
    const wrapperRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const numbOfSlides = Children.toArray(children).length;
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);
    const [grabbing, setGrabbing] = useState<boolean>(false);
    const [movingXPosition, setMovingXPosition] = useState<number>(-0);
    const [stoppedXPosition, setStoppedXPosition] = useState<number>(-0);
    const [slidesToShowState, setSlidesToShowState] = useState<number>(
      slidesToShow[0]
    );
    const [slidesToScrollState, setSlidesToScrollState] = useState<number>(
      slidesToScroll[0]
    );
    const draggableState = draggable && slidesToShowState < numbOfSlides;
    const step = 100 / (numbOfSlides / slidesToScrollState);
    const minStep = -100 + 100 / (numbOfSlides / slidesToShowState);
    const [touchDown, setTouchDown] = useState<number>(0);
    const [currentSpeed, setCurrentSpeed] = useState<number>(speed);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const outOfBoundsSpeed = 800;
    const [visibleSlides, setVisibleSlides] = useState<{
      start: number;
      end: number;
    }>({
      start: currentStep,
      end: slidesToShowState,
    });

    /* What will be returned to be available from ref */
    useImperativeHandle(ref, () => ({
      goToNext: () => {
        const newTransformValue =
          movingXPosition - step < minStep ? minStep : movingXPosition - step;
        setCurrentStepValue(newTransformValue);
        setMovingXPosition(newTransformValue);
        setStoppedXPosition(newTransformValue);
      },
      goToPrevious: () => {
        const newTransformValue =
          movingXPosition + step > 0 ? 0 : movingXPosition + step;
        setCurrentStepValue(newTransformValue);
        setMovingXPosition(newTransformValue);
        setStoppedXPosition(newTransformValue);
      },
      goToSlide: (index: number) => goToSlideFunc(index),
      getCurrentStep: () => currentStep,
    }));

    const goToSlideFunc = (index: number) => {
      setCurrentStep(index);
      const newXValue = -(100 / numbOfSlides) * index;
      if (newXValue < minStep) {
        setMovingXPosition(minStep);
        setStoppedXPosition(minStep);
      } else {
        setMovingXPosition(-(100 / numbOfSlides) * index);
        setStoppedXPosition(-(100 / numbOfSlides) * index);
      }
    };

    /* Deciding which slides that should have aria-hidden false/true value  */
    useEffect(() => {
      setVisibleSlides({
        start: Math.abs(stoppedXPosition / (100 / numbOfSlides)),
        end:
          Math.abs(stoppedXPosition / (100 / numbOfSlides)) +
          slidesToShowState -
          1,
      });
    }, [stoppedXPosition]);

    useEffect(() => {
      if (wrapperRef.current?.offsetWidth) {
        setWrapperWidth(wrapperRef.current?.offsetWidth);
      }
    }, [wrapperRef]);

    const setCurrentStepValue = (xTransformValue: number) => {
      setCurrentStep(Math.abs(xTransformValue / (100 / numbOfSlides)));
    };

    /* Actions functions */
    const onDrag = (position: number, previousPosition: number) => {
      if (!grabbing) {
        return;
      }
      const listWidth = listRef.current?.offsetWidth ?? 1;
      const newTransformValue =
        movingXPosition - ((previousPosition - position) / listWidth) * 100;
      const outOfBounds = minStep > newTransformValue || 0 < newTransformValue;
      setCurrentSpeed(outOfBounds ? outOfBoundsSpeed : 0);
      setTouchDown(position);
      setMovingXPosition(newTransformValue);
    };

    const stoppedMoving = () => {
      setGrabbing(false);
      setCurrentSpeed(speed);
      const percentageOfChange = 25;
      const visibleTransformWidth =
        (slidesToShowState / slidesToScrollState) * step;
      const shouldChange =
        Math.abs(
          ((stoppedXPosition - movingXPosition) / visibleTransformWidth) * 100
        ) >= percentageOfChange;
      const previous = stoppedXPosition - movingXPosition < 0;
      const newSlideValue = Math.abs(
        Math.round(movingXPosition / (100 / numbOfSlides))
      );

      if (shouldChange) {
        if (0 < movingXPosition) {
          goToSlideFunc(0);
        } else if (minStep > movingXPosition) {
          goToSlideFunc(numbOfSlides - 1);
        } else {
          goToSlideFunc(
            newSlideValue === currentStep
              ? newSlideValue + (previous ? -1 : 1)
              : newSlideValue
          );
        }
      } else {
        goToSlideFunc(currentStep);
      }
    };

    const startDragging = (position: number) => {
      setGrabbing(true);
      setTouchDown(position);
    };

    const setArrayValue = (numb: number, arr: number[]): number => {
      if (arr.length > numb) {
        return arr[numb];
      } else {
        return arr[arr.length - 1];
      }
    };

    const setBreakpointAndSize = (screenSize: number) => {
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

      setSlidesToScrollState(newSlidesToScroll);
      setSlidesToShowState(newSlidesToShow);
    };

    useEffect(() => {
      setBreakpointAndSize(window.innerWidth);
      const currentWrapper = listRef.current;
      window.addEventListener("resize", () => {
        if (currentWrapper?.offsetWidth) {
          setWrapperWidth(currentWrapper?.offsetWidth);
        }
        setBreakpointAndSize(window.innerWidth);
      });
      return () => {
        window.removeEventListener("resize", () => {
          if (currentWrapper?.offsetWidth) {
            setWrapperWidth(currentWrapper?.offsetWidth);
          }
          setBreakpointAndSize(window.innerWidth);
        });
      };
    }, []);

    return (
      <div className={classes.root} ref={wrapperRef}>
        <div
          ref={listRef}
          className={clsx(
            classes.list,
            grabbing && classes.grabbing,
            !draggableState && classes.nonDraggable
          )}
          onTouchStart={
            draggableState
              ? (e: React.TouchEvent) =>
                  startDragging(e.changedTouches[0].clientX)
              : undefined
          }
          onTouchEnd={draggableState ? () => stoppedMoving() : undefined}
          onTouchMove={
            draggableState
              ? (e: React.TouchEvent) =>
                  onDrag(e.changedTouches[0].clientX, touchDown)
              : undefined
          }
          onMouseDown={
            draggableState
              ? (e: React.MouseEvent) => startDragging(e.clientX)
              : undefined
          }
          onMouseUp={draggableState ? () => stoppedMoving() : undefined}
          onMouseMove={
            draggableState ? (e) => onDrag(e.clientX, touchDown) : undefined
          }
          onMouseOut={draggableState ? () => stoppedMoving() : undefined}
          style={{
            transition: `transform ${currentSpeed}ms ease`,
            transform: `translateX(${movingXPosition}%)`,
          }}
        >
          {Children.map(children, (child: React.ReactChild, index: number) => {
            if (React.isValidElement(child)) {
              return (
                <div
                  style={{
                    width: wrapperWidth / slidesToShowState,
                  }}
                  className={classes.listItem}
                  data-index={index}
                  aria-hidden={
                    index < visibleSlides.start || index > visibleSlides.end
                  }
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
  }
);

export default Slider;
