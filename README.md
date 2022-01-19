# React Slider

## This is a React Slider with no dependencies except React

### Input props

- #### speed?: number; (optional)
  The speed of slide
  Default value: 500
- #### slidesToShow?: number[]; (optional)
  Array of Numbers of slides to be displayed. Mapped against a value or fallback to the length of the Array.
  For example:
  ```javascript
  [1, 2, 3];
  ```
  Default value:
  ```javascript
  [1];
  ```
- #### slidesToScroll?: number[]; (optional)
  Array of Numbers of slides to scroll onSlide. Mapped against a value or fallback to the length of the Array.
  For example:
  ```javascript
  [1, 2, 3];
  ```
  Default value:
  ```javascript
  [1];
  ```
- #### draggable?: boolean; (optional)
  If the slider is draggable with the mouse or not
  Default value: true
- #### children: React.ReactChild[]; (required)
  Slider elements, will be wrapped with a div element

### Available functions

To access the functions from the Slider you need to use a ref for the slider with the useRef hook

    ```javascript
    const ref = useRef()

    const goToNext = ref.current?.goToNext()
        ...
    <Slider ref={ref} ...
    ```

- ### goToSlide:
  input: number
  Goes to the specific slider item
- ### goToPrevious:
  Goes to the previous step, depending on the slidesToScroll attribute
- ### goToNext:
  Goes to the next step, depending on the slidesToScroll attribute
- ### getCurrentStep:
  Get the currentstep that the slider is on
