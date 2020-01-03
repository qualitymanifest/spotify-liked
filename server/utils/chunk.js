const chunk = (arr, size) => {
  let startIdx = 0;
  let res = [];
  while (startIdx < arr.length) {
    res.push(arr.slice(startIdx, startIdx + size));
    startIdx += size;
  }
  return res;
};

module.exports = chunk;
