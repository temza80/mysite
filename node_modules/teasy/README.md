# Teasy

Takes a big chunk of text and turns it into a shorter teaser by breaking up
sentences.

## Usage

```javascript
var teasy = require('teasy');
var myLongText = '...'; // <- actual long text
var teaser = teasy(myLongText);
```

The `teasy` function takes too additional arguments if you want to customize
the output.

`teasy(text, soft, hard)`

* **soft**, the soft limit. We'll try to cut off the teaser around this number.
* **hard**, the hard limit. If the teaser ends up being longer then this number
the text is cut and an ellipsis is appended.

The defaults are `256` and `512` respectively.

## License

Teasy is released under the MIT license.

