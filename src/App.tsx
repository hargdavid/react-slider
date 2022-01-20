import { makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import Slider from "./components/Slider/Slider";

const useStyles = makeStyles(() => ({
  listItem: {
    listStyleType: "none",
    height: 500,
  },
}));

function App() {
  const classes = useStyles();
  const sliderInstance = useRef<any>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const onNext = async () => {
    await sliderInstance?.current?.goToNext();
    setCurrentStep(sliderInstance?.current?.getCurrentStep());
  };
  const onPrev = () => {
    sliderInstance?.current?.goToPrevious();
  };

  const goToSlide = (numb: number) => {
    sliderInstance?.current?.goToSlide(numb);
  };

  const getCurrent = () => {
    setCurrentStep(sliderInstance?.current?.getCurrentStep());
  };

  const sliderSlidesArr = [
    { backgroundColor: "lightblue" },
    { backgroundColor: "lightyellow" },
    { backgroundColor: "lightgreen" },
    { backgroundColor: "orange" },
    { backgroundColor: "red" },
    { backgroundColor: "lightblue" },
    { backgroundColor: "lightyellow" },
    { backgroundColor: "lightgreen" },
    { backgroundColor: "orange" },
    { backgroundColor: "red" },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => onPrev()}>Prev</button>
        <button onClick={() => onNext()}>Next</button>
        <button onClick={() => getCurrent()}>Get Current</button>
        <div>currentStep: {currentStep}</div>

        <ul>
          {sliderSlidesArr.map((slide, index) => (
            <button key={index} onClick={() => goToSlide(index)}>
              {index}
            </button>
          ))}
        </ul>

        <Slider
          ref={sliderInstance}
          slidesToShow={[1, 2, 6]}
          speed={200}
          slidesToScroll={[1, 2, 3]}
        >
          {sliderSlidesArr.map((slide, index) => (
            <li
              key={`${index}-${slide.backgroundColor}`}
              className={classes.listItem}
              style={{ backgroundColor: slide.backgroundColor }}
            >
              {index}
            </li>
          ))}
        </Slider>
      </header>
    </div>
  );
}

export default App;
