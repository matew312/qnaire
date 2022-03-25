const sortByOrderNum = (a, b) => a.order_num - b.order_num;

export function dictToArraySortedByOrderNum(dict) {
  return Object.values(dict).sort(sortByOrderNum);
}

export function sortArrayByOrderNum(array) {
  return array.sort(sortByOrderNum);
}
