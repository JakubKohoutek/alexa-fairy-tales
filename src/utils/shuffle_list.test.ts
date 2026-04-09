import shuffle from './shuffle_list';

describe('shuffle', () => {
  it('should return an empty array when given an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('should return a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('should return a new array, not mutate the original', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    const result = shuffle(original);

    expect(original).toEqual(originalCopy);
    expect(result).not.toBe(original);
  });

  it('should contain the same elements as the input', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);

    expect(result.sort()).toEqual(input.sort());
  });

  it('should produce different orderings over multiple calls', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set<string>();

    for (let i = 0; i < 20; i++) {
      results.add(JSON.stringify(shuffle(input)));
    }

    expect(results.size).toBeGreaterThan(1);
  });
});
