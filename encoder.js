function encoderGenerator() {
  const api = {};

  let valid = '0123456789';

  /**
    Set the base that will be used by functions encode and decode.

    @param base - It can be either one of the numbers 2, 8, 10, 16, or a string.
      If the value given is a number, it sets the base to the following symbols:
         2: '01'
         8: '01234567'
        10: '0123456789'
        16: '0123456789abcdef'
      If the value given is a string, it must contain the symbols of the base
      ordered from less value to more value.

    @trhows {TypeError} If base is not 2, 8, 10 or 16, it must be a string.
    @throws {Error} All symbols in the base must be unique.
    @throws {Error} The base must have at least two different valid symbols.
  */
  api.setBase = (base) => {
    switch (base) {
      case 2:
        valid = '01';
        break;

      case 8:
        valid = '01234567';
        break;

      case 10:
        // valid is default to base 10. Do nothing
        valid = '0123456789'
        break;

      case 16:
        valid = '0123456789abcdef';
        break;

      default:
        // check if the base is a string
        if (typeof base != 'string') {
          throw new TypeError('Custom bases must be defined with a string' +
            ' containing all the valid characters in the base');
        }
        // check if the base has unique symbols
        baseSet = new Set(base)
        if (base.length != baseSet.size) {
          throw new Error('All symbols in the base must be unique');
        }
        // check if there are at least two symbols in the base
        if (base.length < 2) {
          throw new Error('The base must have at least two different valid symbols');
        }
        valid = base;
    }
  }

  /**
    Encodes the given integer according to the valid symbols.

    @param {Integer} num - Is the number given to be encoded.

    @returns {String} The encoded string.

    @throws {TypeError} The argument must be an Integer.
  */
  api.encode = (num) => {
    // check if num is a number
    if ( (typeof num != 'number') || num % 1 != 0) {
      throw new TypeError(num + ' is not a valid Integer');
    }
    const n = valid.length;

    let output = '';

    while (Math.floor(num / n) > 0) {
      let rem = num % n;
      output = valid[rem] + output;
      num -= rem;
      num /= n;
    }
    if (num % n != 0) {
      output = valid[num % n] + output;
    }

    return output;
  };

  /**
    Decodes the given string according to the valid symbols.

    @param {String} str - Is the string given to be decoded. The user is the
      responsible to check that the base used to encode is the same being used to
      decode.

    @returns {Integer} The integer corresponding to the given string.

    @throws {TypeError} The input must be a string.
    @throws {Error} The input contains symbols that are not in the base.
  */
  api.decode = (str) => {
    if (typeof str != 'string') {
      throw new TypeError('The input for decode() must be a string');
    }
    const n = valid.length;

    let num = 0;
    let p;
    for (let i = 0; i < str.length; i++) {
      p = str.length - 1 - i;
      num += valid.indexOf(str[i]) * Math.pow(n, p);

      if (valid.indexOf(str[i]) === -1) {
        throw new Error('The input for decode() contains symbols that are not' +
          ' in the current base. Illegal symbol: ' + str[i] +
          ' ; Valid symbols are:\n\t' + valid);
      }
    }

    return num;
  };

  /**
    Returns the current base as a string

    @returns {String} A string with the symbols in the current base, ordered
      from smaller to bigger value in the base.
  */
  api.getCurrentBase = () => {
    return valid;
  }
  return api;
}

module.exports = encoderGenerator;