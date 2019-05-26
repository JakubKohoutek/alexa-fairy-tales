const shuffle = <T>(list: T[]): T[] => {
  const newList = [...list];
  newList.forEach((item, oldIndex) => {
    const newIndex = Math.floor(Math.random() * newList.length);
    newList[oldIndex] = newList[newIndex];
    newList[newIndex] = item;
  });

  return newList;
};

export default shuffle;
