const sortByOrderNum = (a, b) => a.order_num - b.order_num;

export function dictToArraySortedByOrderNum(dict) {
  return Object.values(dict).sort(sortByOrderNum);
}

export function sortArrayByOrderNum(array) {
  return array.sort(sortByOrderNum);
}

export function findMaxOrderNum(objects) {
  return Object.keys(objects).reduce((max, id) => {
    const order_num = objects[id].order_num;
    return order_num > max ? order_num : max;
  }, 0);
}
