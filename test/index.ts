import {expect} from 'chai';
import {getObjectsDiff, patch, revert} from '../src/index';
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

describe('patch', () => {
  type TestObject = Partial<{
    a: number;
    b: string;
    c: any[];
  }>;

  it('should add added values to target object', () => {
    expect(
      patch({} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({a: 123});

    expect(
      patch({b: '123'} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({a: 123, b: '123'});

    expect(
      patch({b: '123'} as TestObject, {
        added: {a: 123, c: []},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({a: 123, b: '123', c: []});
  });

  it('should not throw error if added value already exist in object and should override it', () => {
    expect(
      patch({a: 234} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({a: 123});
  });

  it('should modify target object values', () => {
    expect(
      patch({a: 234} as TestObject, {
        added: {},
        removed: {},
        modified: {
          a: [undefined, 123]
        }
      })
    ).to.deep.equal({a: 123});

    expect(
      patch({a: 234, c: ['test']} as TestObject, {
        added: {},
        removed: {},
        modified: {
          a: [undefined, 123],
          c: [[], ['test2']]
        }
      })
    ).to.deep.equal({a: 123, c: ['test2']});
  });

  it('should not throw error if modified value not exist in object and should create it', () => {
    expect(
      patch({a: 123} as TestObject, {
        added: {},
        removed: {},
        modified: {
          b: ['123', '345']
        }
      })
    ).to.deep.equal({a: 123, b: '345'});
  });

  it('should remove values from target object', () => {
    expect(
      patch({a: 123} as TestObject, {
        added: {},
        removed: {
          a: 123
        },
        modified: {}
      })
    ).to.deep.equal({});

    expect(
      patch({a: 123, b: '123'} as TestObject, {
        added: {},
        removed: {
          a: 123
        },
        modified: {}
      })
    ).to.deep.equal({b: '123'});
  });

  it('should not throw error if removed value not exist in object', () => {
    expect(
      patch({a: 123} as TestObject, {
        added: {},
        removed: {b: '123'},
        modified: {}
      })
    ).to.deep.equal({a: 123});
  });
});

describe('revert', () => {
  type TestObject = Partial<{
    a: number;
    b: string;
    c: any[];
  }>;

  it('should remove added values from target object', () => {
    expect(
      revert({a: 123} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({});

    expect(
      revert({a: 123, b: '123'} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({b: '123'});

    expect(
      revert({a: 123, c: [], b: '123'} as TestObject, {
        added: {a: 123, c: []},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({b: '123'});
  });

  it('should not throw error if added value already not exist in object', () => {
    expect(
      revert({} as TestObject, {
        added: {a: 123},
        removed: {},
        modified: {}
      })
    ).to.deep.equal({});
  });

  it('should modify target object values', () => {
    expect(
      revert({a: 234} as TestObject, {
        added: {},
        removed: {},
        modified: {
          a: [undefined, 234]
        }
      })
    ).to.deep.equal({a: undefined});

    expect(
      revert({a: 234, c: ['test']} as TestObject, {
        added: {},
        removed: {},
        modified: {
          a: [undefined, 234],
          c: [[], ['test2']]
        }
      })
    ).to.deep.equal({a: undefined, c: []});
  });

  it('should not throw error if modified value not exist in object and should create it', () => {
    expect(
      revert({a: 123} as TestObject, {
        added: {},
        removed: {},
        modified: {
          b: ['123', '345']
        }
      })
    ).to.deep.equal({a: 123, b: '123'});
  });

  it('should add removed values to target object', () => {
    expect(
      revert({} as TestObject, {
        added: {},
        removed: {
          a: 123
        },
        modified: {}
      })
    ).to.deep.equal({a: 123});

    expect(
      revert({b: '123'} as TestObject, {
        added: {},
        removed: {
          a: 123
        },
        modified: {}
      })
    ).to.deep.equal({a: 123, b: '123'});
  });

  it('should not throw error if removed value exist in object and should override it', () => {
    expect(
      revert({a: 123, b: '234'} as TestObject, {
        added: {},
        removed: {b: '123'},
        modified: {}
      })
    ).to.deep.equal({a: 123, b: '123'});
  });
});
