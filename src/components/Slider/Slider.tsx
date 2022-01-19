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
    cursor: "grab",
    whiteSpace: "nowrap",
  },
  nonDraggable: {
    cursor: "auto",
  },
  listItem: {
    display: "inline-flex",
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
  children: React.ReactChild[];
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

    /* What will be returned to be available from ref */
    useImperativeHandle(ref, () => ({
      goToNext: () => {
        if (isDisabledButtons) {
          return;
        }
        const newTransformValue =
          movingXPosition - step < minStep ? minStep : movingXPosition - step;
        setCurrentStepValue(newTransformValue);
        setMovingXPosition(newTransformValue);
        setStoppedXPosition(newTransformValue);
      },
      goToPrevious: () => {
        if (isDisabledButtons) {
          return;
        }
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

    const setNewScrollAndShowValues = () => {
      const { newSlidesToScroll, newSlidesToShow } = setBreakpointAndSize(
        window.innerWidth,
        slidesToScroll,
        slidesToShow
      );
      setSlidesToScrollState(newSlidesToScroll);
      setSlidesToShowState(newSlidesToShow);
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
                  ? (e: React.MouseEvent) => startDragging(e.clientX)
                  : undefined
              }
              onMouseUp={isDraggable ? () => stoppedMoving() : undefined}
              onMouseMove={
                isDraggable ? (e) => onDrag(e.clientX, touchDown) : undefined
              }
              onMouseOut={isDraggable ? () => stoppedMoving() : undefined}
              style={{
                transition: `transform ${currentSpeed}ms ease`,
                transform: `translateX(${movingXPosition}%)`,
              }}
              data-testid={sliderTestIds.list}
            >
              {Children.map(
                children,
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
                        {React.cloneElement(child, {
                          style: { ...child.props.style, width: "100%" },
                        })}
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
