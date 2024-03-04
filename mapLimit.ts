// https://leetcode.com/discuss/interview-question/2409192/Uber-or-Phone-Screen-or-Senior-Front-End-Engineer
// Implement mapLimit, which is a utility function that produces a list of outputs by mapping each input through an asynchronous iteratee function. The provided limit dictates how many operations can occur at once.

// Inputs
// inputs: An array of inputs.
// limit: The maximum number of operations at any one time.
// iterateeFn: The async function that should be called with each input to generate the corresponding output. It will have two arguments:
//      input: The input being processed.
//      callback: A function that will be called when the input is finished processing. It will be provided one argument, the processed output.
// callback: A function that should be called with the array of outputs once all the inputs have been processed.

const mapLimit = (arr, limit, callback) => {
  let index = 0;
  const answer = [];
  const n = arr.length;

  const cbHandler = async (
    cb,
    resolvePrev = () => {},
    rejectPrev = () => {},
  ) => {
    return new Promise(async (resolve, reject) => {
      let value = null;
      const rej = () => {
        console.log("reject", value);
        reject();
        rejectPrev();
      };
      const res = () => {
        console.log("resolve", value);
        resolve(value);
        resolvePrev();
      };
      try {
        value = await cb();
        if (index < n) {
          answer.push(cbHandler(() => callback(arr[index]), res, rej));
          index = index + 1;
        } else {
          res();
        }
      } catch {
        rej();
      }
    });
  };

  while (index < Math.min(n, limit)) {
    answer.push(cbHandler(() => callback(arr[index])));
    index = index + 1;
  }
  console.log("answer", answer);
  return Promise.all(answer).then(() => answer);
};

mapLimit([1, 2, 3, 4, 5], 1, (num) => {
  console.log("callback", num);
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (num === 3) {
        return rej();
      }
      res(num);
    }, 500 * num);
  });
})
  .then((v) => {
    console.log("Final resolve", v);
  })
  .catch((e) => {
    console.log("Final reject", e);
  });
