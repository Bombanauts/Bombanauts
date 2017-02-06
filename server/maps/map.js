let Maps = [ // 1  2  3  4  5  6  7  8  9  10 11 12
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1], // 1
    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1], // 2
    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1], // 3
    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 4
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 5
    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 6
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 7
    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 8
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 9
    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 10
    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1], // 11
    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1], // 12
    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1], // 13
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 14
  ]


// for randomizing destroyable box tiles while ensuring spawns are clear
const randomGeneration = (arr) => {
  let newArr = [[],[],[],[],[],[],[],[],[],[],[],[],[],[], []]  // Can you do this more cleanly? Also, CONST?
  for (let j = 0; j < arr.length; j++) {
    for (let k = 0; k < arr[0].length; k++) {
      if (arr[j][k] === 3) {
        let random = Math.random();
        if (random > 0.4) newArr[j].push(0)
        else newArr[j].push(3)
      }
      else {
        newArr[j].push(arr[j][k])
      }
    }
  }
  return newArr;
}

// Maps[0] = randomGeneration(Maps[0]);

module.exports = {
  Maps,
  randomGeneration
};
