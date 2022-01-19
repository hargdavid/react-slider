export const setArrayValue = (numb: number, arr: number[]): number => {
  if (arr.length > numb) {
    return arr[numb];
  } else {
    return arr[arr.length - 1];
  }
};
