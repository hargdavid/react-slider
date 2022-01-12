import { makeStyles } from "@material-ui/core";
import React from "react";
import Slider from "./components/Slider/Slider";

const useStyles = makeStyles(() => ({
  listItem: {
    listStyleType: "none",
    /* width: "100%", */
    height: 200,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <Slider>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightblue" }}
          >
            1
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightyellow" }}
          >
            2
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightgreen" }}
          >
            3
          </li>
        </Slider>
      </header>
    </div>
  );
}

export default App;
