import { makeStyles } from "@material-ui/core";
import React from "react";
import { useSlider } from "./components/Slider/Slider";

const useStyles = makeStyles(() => ({
  listItem: {
    listStyleType: "none",
    height: 500,
  },
}));

function App() {
  const classes = useStyles();
  const { goToNext, render, goToPrevious } = useSlider({
    children: [<div></div>],
  });
  /* const Slider = useSlider */

  /*   console.log("goToNext", goToNext()); */

  return (
    <div className="App">
      <header className="App-header">
        {/*  <Slider slidesToShow={4} speed={200} slidesToScroll={4}>
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
          <li
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
          </li>
        </Slider> */}
      </header>
    </div>
  );
}

export default App;
