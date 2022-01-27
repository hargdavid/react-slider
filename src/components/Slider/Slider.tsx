import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, {
  Children,
  createRef,
  forwardRef,
  ReactChild,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { setBreakpointAndSize } from "../../helpers/setBreakpointAndSize";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    direction: "ltr",
    position: "relative",
    overflowX: "hidden",
    width: "100%",
  },
  grabbing: {
    cursor: "grabbing",
  },
  list: {
    display: "flex",
    flexFlow: "row",
    cursor: "grab",
    whiteSpace: "nowrap",
  },
  nonDraggable: {
    cursor: "auto",
  },
  listItem: {
    cursor: "grab",
    display: "flex",
    "& :nth-child(1)": {
      width: "100%",
    },
  },
}));

export const sliderTestIds = {
  list: "SlidertestIds_list",
  slide: "SlidertestIds_slide",
};

export interface ISliderSettings {
  speed?: number;
  slidesToShow?: number[];
  slidesToScroll?: number[];
  draggable?: boolean;
  children: any[];
  getCurrentSlide?: (numb: number) => void;
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
      getCurrentSlide,
    } = props;
    const classes = useStyles();
    const wrapperRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const numbOfSlides = Children.toArray(children).length;
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);
    const [grabbing, setGrabbing] = useState<boolean>(false);
    const [dragging, setDragging] = useState<boolean>(false);
    const [movingXPosition, setMovingXPosition] = useState<number>(-0);
    const [stoppedXPosition, setStoppedXPosition] = useState<number>(-0);
    const [slidesToShowState, setSlidesToShowState] = useState<number>(
      slidesToShow[0]
    );
    const [slidesToScrollState, setSlidesToScrollState] = useState<number>(
      slidesToScroll[0]
    );
    const isDraggable = draggable && slidesToShowState < numbOfSlides;
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
      end: slidesToShowState - 1,
    });
    const [isDisabledButtons, setIsDisabledButtons] = useState<boolean>(
      visibleSlides.start === 0 && numbOfSlides <= visibleSlides.end
    );

    useEffect(() => {
      if (getCurrentSlide) {
        getCurrentSlide(currentStep);
      }
    }, [currentStep]);

    /* What will be returned to be available from ref */
    useImperativeHandle(ref, () => ({
      goToNext: () => goToNextFunc(),
      goToPrevious: () => goToPrevFunc(),
      goToSlide: (index: number) => goToSlideFunc(index),
      getCurrentStep: () => currentStep,
    }));

    const goToNextFunc = () => {
      if (isDisabledButtons) {
        return;
      }
      const newTransformValue =
        movingXPosition - step < minStep ? minStep : movingXPosition - step;
      setCurrentStepValue(newTransformValue);
      setMovingXPosition(newTransformValue);
      setStoppedXPosition(newTransformValue);
    };

    const goToPrevFunc = () => {
      if (isDisabledButtons) {
        return;
      }
      const newTransformValue =
        movingXPosition + step > 0 ? 0 : movingXPosition + step;
      setCurrentStepValue(newTransformValue);
      setMovingXPosition(newTransformValue);
      setStoppedXPosition(newTransformValue);
    };

    const goToSlideFunc = (index: number) => {
      if (isDisabledButtons) {
        return;
      }

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

    const setNewScrollAndShowValues = () => {
      const { newSlidesToScroll, newSlidesToShow } = setBreakpointAndSize(
        window.innerWidth,
        slidesToScroll,
        slidesToShow
      );
      setSlidesToScrollState(newSlidesToScroll);
      setSlidesToShowState(newSlidesToShow);
    };

    /* Actions functions */
    const onDrag = (position: number, previousPosition: number) => {
      if (!grabbing) {
        return;
      }
      setDragging(true);
      setOverflowToBody(true);
      const listWidth = listRef.current?.offsetWidth ?? 1;
      const newTransformValue =
        movingXPosition - ((previousPosition - position) / listWidth) * 100;
      const outOfBounds = minStep > newTransformValue || 0 < newTransformValue;
      setCurrentSpeed(outOfBounds ? outOfBoundsSpeed : 0);
      setTouchDown(position);
      setMovingXPosition(newTransformValue);
    };

    const stoppedMoving = (e?: React.MouseEvent) => {
      e?.preventDefault();

      /* This is needed so the mouseUp event after drag is done won't fire after this state has changed */
      setTimeout(() => {
        setDragging(false);
      }, 1);
      setGrabbing(false);
      setCurrentSpeed(speed);
      setOverflowToBody(false);
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
        const x =
          0 < movingXPosition
            ? 0
            : minStep > movingXPosition
            ? numbOfSlides - 1
            : newSlideValue === currentStep
            ? newSlideValue + (previous ? -1 : 1)
            : newSlideValue;

        goToSlideFunc(x);
      } else {
        goToSlideFunc(currentStep);
      }
    };

    const startDragging = (position: number, e?: React.MouseEvent) => {
      e?.preventDefault();
      setGrabbing(true);
      setTouchDown(position);
    };

    const setOverflowToBody = (grab: boolean) => {
      if (grab) {
        document.body.style.overflowX = "hidden";
      } else {
        setTimeout(() => {
          document.body.style.overflowX = "";
        }, speed);
      }
    };

    /* Deciding which slides that should have aria-hidden false/true value  */
    useEffect(() => {
      setVisibleSlides({
        start: Math.round(Math.abs(stoppedXPosition / (100 / numbOfSlides))),
        end: Math.round(
          Math.abs(stoppedXPosition / (100 / numbOfSlides)) +
            slidesToShowState -
            1
        ),
      });
    }, [stoppedXPosition, slidesToShowState]);

    useEffect(() => {
      setIsDisabledButtons(
        visibleSlides.start === 0 && numbOfSlides <= visibleSlides.end
      );
    }, [numbOfSlides, visibleSlides]);

    useEffect(() => {
      if (wrapperRef.current?.offsetWidth) {
        setWrapperWidth(wrapperRef.current?.offsetWidth);
      }
    }, [wrapperRef]);

    const setCurrentStepValue = (xTransformValue: number) => {
      setCurrentStep(
        Math.round(Math.abs(xTransformValue / (100 / numbOfSlides)))
      );
    };

    const onClickHandler = (e: React.MouseEvent) => {
      if (dragging) {
        e.preventDefault();
      }
    };

    const handleKeyEvent = (e: React.KeyboardEvent) => {
      switch (e.code) {
        case "ArrowRight":
          goToNextFunc();
          break;
        case "ArrowLeft":
          goToPrevFunc();
          break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9": {
          const value = Number(e.code.replace("Digit", ""));
          if (numbOfSlides >= value && value > 0) {
            goToSlideFunc(value - 1);
          }
          break;
        }
        default:
          break;
      }
    };

    useEffect(() => {
      setNewScrollAndShowValues();

      const currentWrapper = listRef.current;
      window.addEventListener("resize", () => {
        if (currentWrapper?.offsetWidth) {
          setWrapperWidth(currentWrapper?.offsetWidth);
        }
        setNewScrollAndShowValues();
      });
      return () => {
        window.removeEventListener("resize", () => {
          if (currentWrapper?.offsetWidth) {
            setWrapperWidth(currentWrapper?.offsetWidth);
          }
          setNewScrollAndShowValues();
        });
      };
    }, []);

    return (
      <>
        {numbOfSlides > 0 && (
          <div className={classes.root} ref={wrapperRef}>
            <div
              role="tablist"
              ref={listRef}
              className={clsx(
                classes.list,
                grabbing && classes.grabbing,
                !isDraggable && classes.nonDraggable
              )}
              onTouchStart={
                isDraggable
                  ? (e: React.TouchEvent) =>
                      startDragging(e.changedTouches[0].clientX)
                  : undefined
              }
              onTouchEnd={isDraggable ? () => stoppedMoving() : undefined}
              onTouchMove={
                isDraggable
                  ? (e: React.TouchEvent) =>
                      onDrag(e.changedTouches[0].clientX, touchDown)
                  : undefined
              }
              onMouseDown={
                isDraggable
                  ? (e: React.MouseEvent) => startDragging(e.clientX, e)
                  : undefined
              }
              onMouseUp={
                isDraggable
                  ? (e: React.MouseEvent) => stoppedMoving(e)
                  : undefined
              }
              onMouseMove={
                isDraggable
                  ? (e: React.MouseEvent) => onDrag(e.clientX, touchDown)
                  : undefined
              }
              onMouseOut={isDraggable ? () => stoppedMoving() : undefined}
              onBlur={isDraggable ? () => stoppedMoving() : undefined}
              onKeyUp={(e: React.KeyboardEvent) => handleKeyEvent(e)}
              onClick={(e: React.MouseEvent) => onClickHandler(e)}
              style={{
                transition: `transform ${currentSpeed}ms ease`,
                transform: `translateX(${movingXPosition}%)`,
              }}
              data-testid={sliderTestIds.list}
              tabIndex={0}
            >
              {Children.map(
                children as ReactChild[],
                (child: React.ReactChild, index: number) => {
                  if (React.isValidElement(child)) {
                    return (
                      <div
                        style={{
                          width: wrapperWidth / slidesToShowState,
                        }}
                        className={classes.listItem}
                        data-index={index}
                        aria-hidden={
                          index < visibleSlides.start ||
                          index > visibleSlides.end
                        }
                        data-testid={sliderTestIds.slide}
                      >
                        {React.cloneElement(child, { draggable: true })}
                      </div>
                    );
                  }
                }
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default Slider;
