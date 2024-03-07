import { open } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

async function getResults(pathToFile) {
  try {
    const start = Date.now();

    const file = await open(pathToFile);
    const arrayOfNumbers = [];
    let maxAscending = [];
    let currAsc = [];
    let maxDescending = [];
    let currDesc = [];
    let prevValue;
    let min;
    let max;
    let sum = 0;

    for await (const line of file.readLines()) {
      const number = parseInt(line);
      sum += number;
      arrayOfNumbers.push(number);

      // init values of min and max and previus value
      if (arrayOfNumbers.length === 2) {
        [prevValue] = arrayOfNumbers;
        currAsc.push(prevValue);
        currDesc.push(prevValue);
        if (arrayOfNumbers[0] < arrayOfNumbers[1]) {
          [min, max] = arrayOfNumbers;
        } else [max, min] = arrayOfNumbers;
      }

      //calculated minimum and maximum
      if (number > max) {
        max = number;
      } else if (number < min) {
        min = number;
      }

      //resolving maximum of sequences
      if (arrayOfNumbers.length >= 2) {
        if (number > prevValue) {
          currAsc.push(number);
          if (currDesc.length > maxDescending.length) {
            maxDescending = [...currDesc];
          }
          currDesc = [number];
        } else {
          currDesc.push(number);
          if (currAsc.length > maxAscending.length) {
            maxAscending = [...currAsc];
          }
          currAsc = [number];
        }

        prevValue = number;
      }
    }
    // calculated median
    const median =
      arrayOfNumbers.length % 2 === 0
        ? getMedianEvenArray(arrayOfNumbers)
        : getMedianOddArray(arrayOfNumbers);

    function getMedianEvenArray(arr) {
      return (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2;
    }

    function getMedianOddArray(arr) {
      return arr[Math.floor(arr.length / 2)];
    }

    console.log("min", min);
    console.log("max", max);
    console.log("average", sum / arrayOfNumbers.length);
    console.log("median", median);
    console.log("max asc", maxAscending);
    console.log("max desc", maxDescending);

    const end = Date.now();

    return (end - start) / 1000;
  } catch (error) {
    console.error("Some error is happened", error);
  }
}

const pathToFile = path.resolve(process.cwd(), "10m.txt");

getResults(pathToFile)
  .then((x) => console.log("time", x))
  .catch((err) => console.log(err));
