const arrayEquality = (array1 = [], array2 = []) => {
    if (array1.length !== array2.length) return false;
    const sortedArray1 = [...array1].sort();
    const sortedArray2 = [...array2].sort();
    return sortedArray1.every((element, index) => element === sortedArray2[index]);
  };
  
  export default arrayEquality