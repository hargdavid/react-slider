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

/* //TODO  
  - responsive
  - get the currentStep on a good way
  - slider move when 25% of the displayed element is moved
  - hovering bug goes to first page
*/

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
  slidesToShow?: number;
  slidesToScroll?: number;
  draggable?: boolean;
  children: React.ReactChild[];
}

type Props = ISliderSettings & React.RefAttributes<unknown>;

const Slider: React.ForwardRefExoticComponent<Props> = forwardRef(
  (props: ISliderSettings, ref) => {
    const {
      speed = 500,
      slidesToShow = 1,
      slidesToScroll = 1,
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
    const step = 100 / (numbOfSlides / slidesToScroll);
    const minStep = -100 + 100 / (numbOfSlides / slidesToShow);
    const [touchDown, setTouchDown] = useState<number>(0);
    const [currentSpeed, setCurrentSpeed] = useState<number>(speed);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const outOfBoundsSpeed = 800;
    const [visibleSlides, setVisibleSlides] = useState<{
      start: number;
      end: number;
    }>({
      start: currentStep,
      end: slidesToShow,
    });

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
      goToSlide: (index: number) => {
        setCurrentStep(index);
        const newXValue = -(100 / numbOfSlides) * index;
        if (newXValue < minStep) {
          setMovingXPosition(minStep);
        } else {
          setStoppedXPosition(minStep);
          setMovingXPosition(-(100 / numbOfSlides) * index);
          setStoppedXPosition(-(100 / numbOfSlides) * index);
        }
      },
      getCurrentStep: () => currentStep,
    }));

    useEffect(() => {
      setVisibleSlides({
        start: Math.abs(stoppedXPosition / (100 / numbOfSlides)),
        end:
          Math.abs(stoppedXPosition / (100 / numbOfSlides)) + slidesToShow - 1,
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

      const shouldChange =
        (Math.abs(stoppedXPosition - movingXPosition) / step) * 100 >=
        percentageOfChange;
      const previous = stoppedXPosition - movingXPosition < 0;

      const newValue = shouldChange
        ? previous
          ? stoppedXPosition + step
          : stoppedXPosition - step
        : stoppedXPosition;

      if (!(newValue > 0 || newValue < minStep)) {
        setCurrentStepValue(newValue);
      } else if (newValue > 0) {
        setCurrentStepValue(0);
      } else {
        setCurrentStepValue(minStep);
      }

      const newPosition =
        newValue > 0 ? 0 : newValue < minStep ? minStep : newValue;

      setMovingXPosition(newPosition);
      setStoppedXPosition(newPosition);
    };

    const startDragging = (position: number) => {
      setGrabbing(true);
      setTouchDown(position);
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
            transform: `translateX(${movingXPosition}%)`,
          }}
        >
          {Children.map(children, (child: React.ReactChild, index: number) => {
            if (React.isValidElement(child)) {
              return (
                <div
                  style={{
                    width: wrapperWidth / slidesToShow,
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
