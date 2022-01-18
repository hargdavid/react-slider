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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => onPrev()}>Prev</button>
        <button onClick={() => onNext()}>Next</button>
        <button onClick={() => getCurrent()}>Get Current</button>
        <div>currentStep: {currentStep}</div>

        <ul>
          <button onClick={() => goToSlide(0)}>0</button>
          <button onClick={() => goToSlide(1)}>1</button>
          <button onClick={() => goToSlide(2)}>2</button>
          {/*   <button onClick={() => goToSlide(3)}>3</button>
          <button onClick={() => goToSlide(4)}>4</button>
          <button onClick={() => goToSlide(5)}>5</button>
          <button onClick={() => goToSlide(6)}>6</button>
          <button onClick={() => goToSlide(7)}>7</button>
          <button onClick={() => goToSlide(8)}>8</button>
          <button onClick={() => goToSlide(9)}>9</button> */}
        </ul>

        <Slider
          ref={sliderInstance}
          slidesToShow={[1, 2, 4]}
          speed={200}
          slidesToScroll={[1, 2, 4]}
        >
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightblue" }}
            onClick={() => console.log("hellog")}
          >
            0
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightyellow" }}
            onClick={() => console.log("hellog")}
          >
            1
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightgreen" }}
            onClick={() => console.log("hellog")}
          >
            2
          </li>
          {/*   <li
            className={classes.listItem}
            style={{ backgroundColor: "orange" }}
            onClick={() => console.log("hellog")}
          >
            3
          </li>
          <li className={classes.listItem} style={{ backgroundColor: "red" }}>
            4
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightblue" }}
            onClick={() => console.log("hellog")}
          >
            5
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightyellow" }}
            onClick={() => console.log("hellog")}
          >
            6
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightgreen" }}
            onClick={() => console.log("hellog")}
          >
            7
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "orange" }}
            onClick={() => console.log("hellog")}
          >
            8
          </li>
          <li className={classes.listItem} style={{ backgroundColor: "red" }}>
            9
          </li> */}
        </Slider>
      </header>
    </div>
  );
}

export default App;
