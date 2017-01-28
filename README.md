# Custom Encoder
Encoder from integers to any custom base and vice-versa

## Installation
```
npm install --save custom-encoder
```

## Usage
The package exports a function that generates the encoder. you can simply call the generator to store the encoder itself --as in example 1--, or you can store the function and call it each time you need a new encoder --as in example 2--.

``` js
// Require the package
const encoder = require('custom-encoder')();

// Set a new base
encoder.setBase(myCustomBase);

// Encode an integer to the current base
let myIntEncoded = encoder.encode(myInt);

// Decode from a String according to the current base
let myDecodedInt = encoder.decode(myIntEncoded);

// Get the current base as a string
let myBase = encoder.getBase();
```

You can create more than one encoder if you need to use more than one different base at the same time.
``` js
const encoderGenerator = require('custom-encoder');
const encoder1 = encoderGenerator();
const encoder2 = encoderGenerator();

encoder1.setBase(2);
encoder2.setBase('ab');

console.log(encoder1.encode(10)); // prints: '1010'
console.log(encoder2.encode(10)); // prints: 'baba'
```

## API

The API is very simple. There are four methods:
 - [_encoder_.setBase()](#encodersetbase)
 - [_encoder_.encode()](#encoderencode)
 - [_encoder_.decode()](#encoderdecode)
 - [_encoder_.getCurrentBase()](#encodergetcurrentbase)

### _encoder_.setBase()
Set the base that will be used by functions encode and decode.

##### Syntax
```js
encoder.setBase(base)
```
##### Params
**`base`**  
It can be either one of the numbers 2, 8, 10, 16, or a string. If the value given is a number, it sets the base to the following symbols:
 - 2: `01`
 - 8: `01234567`
 - 10: `0123456789`
 - 16: `0123456789abcdef`  

If the value given is a string, it must contain the symbols of the base
ordered from less value to more value.

##### Throws
It trows the following errors:
- _`TypeError`_: If `base` is not 2, 8, 10 or 16, it must be a string.
- _`Error`_: All symbols in the base must be unique.
- _`Error`_: The base must have at least two different valid symbols.

##### Example
```js
// Set the base to binary
encoder.setBase(2);

// Set the base to hexadecimal
encoder.setBase(16);

// Set a custom base where the symbol 'b' is one unit bigger than 'a', and
// symbol '1' is one unit bigger than 'd'
encoder.setBase('abcd1234') 
```

### _encoder_.encode()
Encodes the given integer according to the current base.

##### Syntax
```js
encoder.encode(intNumber)
```
##### Params
**`intNumber`**  
Is the number given to be encoded. It must be an integer, or the function throws an error.

##### Returns
It returns a string with the encoded value of `intNumber` according to the current base.

##### Throws
It trows the following error:
- _`TypeError`_: The given number `intNumber` must be an integer.

##### Example
```js
// Set the base to binary
encoder.setBase(2);
encoder.encode(10); // result: '1010'

// Set the base to hexadecimal
encoder.setBase(16);
encoder.encode(195951310); // result: 'badface'

// Set a custom base
encoder.setBase('myfriend');
encoder.encode(481); // result: 'diy'
```

### _encoder_.decode()
Decodes the given string according to the current base.

##### Syntax
```js
encoder.decode(codedString)
```
##### Params
**`codedString`**  
Is the string given to be decoded. The user is the responsible to check that the base used to encode is the same being used to decode.

##### Returns
It returns the integer corresponding to the given encoded string according to the current base.

##### Throws
It trows the following errors:
- _`TypeError`_: The input must be a string.
- _`Error`_: The input contains symbols that are not in the base.

##### Example
```js
// Set the base to binary
encoder.setBase(2);
encoder.decode('1010'); // result: 10

// Set the base to hexadecimal
encoder.setBase(16);
encoder.encode('badface'); // result: 195951310

// Set a custom base
encoder.setBase('myfriend');
encoder.encode('diy'); // result: 481
```

### _encoder_.getCurrentBase()
Returns the current base as a string of the symbols used.

##### Syntax
```js
encoder.getCurrentBase()
```

##### Returns
A string with the symbols in the current base, ordered from smaller to bigger value in the base.

##### Example
```js
// Set the base to binary
encoder.setBase(2);
encoder.getCurrentBase(); // result: '01'

// Set the base to hexadecimal
encoder.setBase(16);
encoder.getCurrentBase(); // result: '0123456789abcdef'

// Set a custom base
encoder.setBase('myfriend');
encoder.getCurrentBase(); // result: 'myfriend'
```