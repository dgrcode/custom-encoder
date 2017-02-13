const enc = require('../encoder')();
var assert = require('assert');

describe('The default encoder', () => {
	it('should be set as base 10', () => {
		assert.equal(enc.encode(152), '152');
		assert.equal(enc.decode('42345'), 42345);
	});
});

describe('Setting a new base', () => {
	it('should throw a TypeError if it is passed a number' +
			' other than 2, 8, 10 or 16', () => {
		for (let num of [2, 8, 10, 16]) {
			assert.doesNotThrow(() => {
				enc.setBase(num);
			}, TypeError);
		}
		for (let num of [4, 7, 20, 100]) {
			assert.throws(() => {
				enc.setBase(num);
			}, TypeError);
		}
	});

	it('should throw an Error if passed an unitary base', () => {
		assert.throws(() => {
			enc.setBase('0');
		}, Error);
		assert.throws(() => {
			enc.setBase('a');
		}, Error);
		assert.doesNotThrow(() => {
			enc.setBase('01');
		}, Error);
	});

	it('should throw an Error if passed a base with repeated symbols', () => {
		assert.throws(() => {
			enc.setBase('abca');
		}, Error);
		assert.throws(() => {
			enc.setBase('0121');
		}, Error);
		assert.doesNotThrow(() => {
			enc.setBase('0123');
		}, Error);
	});
});

describe('Encoding a number', () => {
	it('should throw a TypeError if the argument is not an Integer', () => {
		assert.throws(() => {
			enc.encode('abc');
		}, TypeError);
		assert.throws(() => {
			enc.encode('123');
		}, TypeError, 'Numeric string is cosidered valid');
		assert.throws(() => {
			enc.encode(123.12);
		}, TypeError, 'Float numbers are processed');
		assert.doesNotThrow(() => {
			enc.encode(123);
		}, TypeError, 'Falla con el float');
	});

	it('should return the lowest char when the number is zero', () => {
		enc.setBase(2);
		assert.equal(enc.encode(0), "0");
		enc.setBase(8);
		assert.equal(enc.encode(0), "0");
		enc.setBase(16);
		assert.equal(enc.encode(0), "0");
		enc.setBase(10);
		assert.equal(enc.encode(0), "0");
		enc.setBase('abcd');
		assert.equal(enc.encode(0), "a");
	});

	it('should encode in base 2 correctly', () => {
		enc.setBase(2);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(2))
		}
	});

	it('should encode in base 8 correctly', () => {
		enc.setBase(8);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(8))
		}
	});

	it('should encode in base 16 correctly', () => {
		enc.setBase(16);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(16))
		}
	});

	it('should encode in a custom base correctly (base 5)', () => {
		enc.setBase('01234');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(5));
		}
	});

	it('should encode in a custom base correctly (base 32)', () => {
		enc.setBase('0123456789abcdefghijklmnopqrstuv');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(32));
		}
	});

	it('should encode in a custom base correctly (base 36)', () => {
		enc.setBase('0123456789abcdefghijklmnopqrstuvwxyz');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			assert.equal(enc.encode(num), num.toString(36));
		}
	});

	it('should encode in a custom base correctly (base: "ab")', () => {
		enc.setBase('ab');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let expectedEncoding = num.toString(2).replace(/0/g, 'a').replace(/1/g, 'b');
			assert.equal(enc.encode(num), expectedEncoding);
		}
	});

	// Random base tests
	let validRandomBaseChars = '0123456789abcdefghijklmnopqrstuvwxyz';
	for (let j = 0; j < 5; j++) {
		// generate the new base
		let baseLength = Math.floor(Math.random() * (validRandomBaseChars.length + 1 - 2)) + 2;
		// we have to remove as many symbols as validRandomBaseChars.length - baseLength
		let remainingRemovals = validRandomBaseChars.length - baseLength;
		let s = new Set(validRandomBaseChars);
		while (remainingRemovals > 0) {
			let a = Array.from(s);
			let indexRemoved = Math.floor(Math.random() * (a.length + 1));
			s.delete(a[indexRemoved])
			remainingRemovals--;
		}

		let newCustomBase = Array.from(s).join('');

		// do the tests
		it('should encode from a custom random base correctly (base: "' +
					newCustomBase + '")', () => {
			enc.setBase(newCustomBase);
			for (let i = 0; i < 1000; i++) {
				let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // new random number
				let encodedNumStd = num.toString(newCustomBase.length); // random number -> std base converted
				// generate a map to do conversion from std to custom base
				let stdToCustomMap = {};
				newCustomBase.split('').map((val, idx) => {
					let customChar = val;
					let stdChar = validRandomBaseChars[idx];
					stdToCustomMap[stdChar] = customChar;
				});
				
				let expectedEncoding = '';
				for (let k = 0; k < encodedNumStd.length; k++) {
					let currentStdChar = encodedNumStd[k];
					expectedEncoding += stdToCustomMap[currentStdChar];
				}

				assert.equal(enc.encode(num), expectedEncoding);
			}
		});
	}
});

describe('Decoding a string', () => {
	it('should throw a TypeError if the argument is not a string', () => {
		assert.throws(() => {
			enc.setBase(10);
			enc.decode(123);
		}, TypeError);
		assert.doesNotThrow(() => {
			enc.setBase(10);
			enc.decode('123');
		}, TypeError);
	});

	it('should throw an Error if the argument contains symbols' +
				' that are not in the base', () => {
		assert.throws(() => {
			enc.setBase('abc')
			enc.decode('abcd');
		}, Error);
		assert.doesNotThrow(() => {
			enc.setBase('abc')
			enc.decode('acbcabcacbca');
		}, Error);
	});	

	it('should decode from base 2 correctly', () => {
		enc.setBase(2);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(2);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 2))
		}
	});

	it('should decode from base 8 correctly', () => {
		enc.setBase(8);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(8);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 8))
		}
	});

	it('should decode from base 16 correctly', () => {
		enc.setBase(16);
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(16);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 16))
		}
	});

	it('should decode from a custom base correctly (base 5)', () => {
		enc.setBase('01234'); // base 5
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(5);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 5))
		}
	});

	it('should decode from a custom base correctly (base 32)', () => {
		enc.setBase('0123456789abcdefghijklmnopqrstuv'); // base 32
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(32);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 32))
		}
	});

	it('should decode from a custom base correctly (base 36)', () => {
		enc.setBase('0123456789abcdefghijklmnopqrstuvwxyz');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNum = num.toString(36);
			assert.equal(enc.decode(encodedNum), parseInt(encodedNum, 36))
		}
	});

	it('should decode from a custom base correctly (base: "ab")', () => {
		enc.setBase('ab');
		for (let i = 0; i < 1000; i++) {
			let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			let encodedNumStd = num.toString(2);
			let encodedNum = encodedNumStd.replace(/0/g, 'a').replace(/1/g, 'b');
			assert.equal(enc.decode(encodedNum), parseInt(encodedNumStd, 2))
		}
	});
	
	// Random base tests
	let validRandomBaseChars = '0123456789abcdefghijklmnopqrstuvwxyz';
	for (let j = 0; j < 5; j++) {
		// generate the new base
		let baseLength = Math.floor(Math.random() * (validRandomBaseChars.length + 1 - 2)) + 2;
		// we have to remove as many symbols as validRandomBaseChars.length - baseLength
		let remainingRemovals = validRandomBaseChars.length - baseLength;
		let s = new Set(validRandomBaseChars);
		while (remainingRemovals > 0) {
			let a = Array.from(s);
			let indexRemoved = Math.floor(Math.random() * (a.length + 1));
			s.delete(a[indexRemoved])
			remainingRemovals--;
		}

		let newCustomBase = Array.from(s).join('');

		// do the tests
		it('should decode from a custom random base correctly (base: "' +
					newCustomBase + '")', () => {
			enc.setBase(newCustomBase);
			for (let i = 0; i < 1000; i++) {
				let num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // new random number
				let encodedNumStd = num.toString(newCustomBase.length); // random number -> std base converted
				// generate a map to do conversion from std to custom base
				let stdToCustomMap = {};
				newCustomBase.split('').map((val, idx) => {
					let customChar = val;
					let stdChar = validRandomBaseChars[idx];
					stdToCustomMap[stdChar] = customChar;
				});
				
				let encodedNum = '';
				for (let k = 0; k < encodedNumStd.length; k++) {
					let currentStdChar = encodedNumStd[k];
					encodedNum += stdToCustomMap[currentStdChar];
				}

				assert.equal(enc.decode(encodedNum), parseInt(encodedNumStd, newCustomBase.length))
			}
		});
	}
});

describe('Requiring two instances of the encoder', () => {
	it('should allow to work with two different bases', () => {
		const enc2 = require('../encoder')();
		enc.setBase(10);
		enc2.setBase('ab');
		let number = 12340;
		assert.notEqual(enc.encode(number), enc2.encode(number));
	});
});