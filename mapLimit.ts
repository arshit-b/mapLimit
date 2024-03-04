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
