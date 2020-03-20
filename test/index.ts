import {expect} from 'chai';
import {getObjectsDiff} from '../src/index';
import {isEqual} from '../src/is-equal';

describe('isEqual', () => {
  const TEST_VALUES = [
    'b',
    1,
    undefined,
    null,
    '2',
    0.3,
    ['a', 3, 4],
    {a: 'a'}
  ];

  it('should test strings', () => {
    expect(isEqual('a', 'a')).to.be.true;
    expect(TEST_VALUES.every((val) => isEqual('a', val))).to.be.false;
  });

  it('should test numbers', () => {
    expect(isEqual(123, 123)).to.be.true;
    expect(TEST_VALUES.every((val) => isEqual(123, val))).to.be.false;
  });

  it('should test array', () => {
    expect(isEqual([1, 2, 3, 'a'], [1, 2, 3, 'a'])).to.be.true;
    expect(isEqual([1, 2, 3, 'a', [1, 2, 3]], [1, 2, 3, 'a', [1, 2, 3]])).to.be
      .true;

    expect(isEqual([1, 2, 3, 'a', [1, 2, 3]], [1, 2, 3, [1, 2, 3], 'a'])).to.be
      .false;

    expect(isEqual([1], [1, 2, 3, [1, 2, 3], 'a'])).to.be.false;
    expect(TEST_VALUES.every((val) => isEqual([123], val))).to.be.false;
  });
});

describe('getObjectDiff', () => {
  console.log();

  it('checks if objects are equal', () => {
    expect(getObjectsDiff({a: 123}, {a: 123})).to.deep.equal({
      added: {},
      removed: {},
      modified: {}
    });
  });

  type TestType = Partial<{
    a: number | string;
    b: boolean;
  }>;

  it('checks if added values returns correctly', () => {
    const EXPECTED_VALUE = {
      added: {a: 123},
      removed: {},
      modified: {}
    };
    expect(getObjectsDiff({}, {a: 123})).to.deep.equal(EXPECTED_VALUE);

    expect(
      getObjectsDiff({b: true} as TestType, {a: 123, b: true})
    ).to.deep.equal(EXPECTED_VALUE);
  });

  it('checks if removed values returns correctly', () => {
    const EXPECTED_VALUE = {
      added: {},
      removed: {a: 123},
      modified: {}
    };
    expect(getObjectsDiff({a: 123}, {})).to.deep.equal(EXPECTED_VALUE);

    expect(
      getObjectsDiff({a: 123, b: true} as TestType, {b: true})
    ).to.deep.equal(EXPECTED_VALUE);
  });

  it('checks if modified values returns correctly', () => {
    const EXPECTED_VALUE = {
      added: {},
      removed: {},
      modified: {a: [123, '123']}
    };
    expect(getObjectsDiff({a: 123} as TestType, {a: '123'})).to.deep.equal(
      EXPECTED_VALUE
    );

    expect(
      getObjectsDiff({a: 123, b: true} as TestType, {a: '123', b: true})
    ).to.deep.equal(EXPECTED_VALUE);
  });
});
