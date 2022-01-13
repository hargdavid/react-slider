import { makeStyles } from "@material-ui/core";
import React from "react";
import Slider from "./components/Slider/Slider";

const useStyles = makeStyles(() => ({
  listItem: {
    listStyleType: "none",
    height: 500,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        {/*   <Slider
          slidesToShow={3}
          speed={200}
          slidesToScroll={1}
          dots
          draggable={false}
        >
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
          <li
            className={classes.listItem}
            style={{ backgroundColor: "orange" }}
          >
            4
          </li>
        </Slider> */}

        <Slider slidesToShow={1} speed={200} slidesToScroll={1} dots>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightblue" }}
            onClick={() => console.log("hellog")}
          >
            1
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightyellow" }}
            onClick={() => console.log("hellog")}
          >
            2
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "lightgreen" }}
            onClick={() => console.log("hellog")}
          >
            3
          </li>
          <li
            className={classes.listItem}
            style={{ backgroundColor: "orange" }}
            onClick={() => console.log("hellog")}
          >
            4
          </li>
        </Slider>
      </header>
    </div>
  );
}

export default App;
