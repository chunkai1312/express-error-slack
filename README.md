# express-error-slack

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]

> Express error handling middleware for reporting error to Slack

## Install

```
$ npm install --save express-error-slack
```

## Usage

```js
const express = require('express')
const errorToSlack = require('express-error-slack')

const app = express()

// Route that triggers a error
app.get('/error', function (req, res, next) {
  const err = new Error('Internal Server Error')
  err.status = 500
  next(err)
})

// Send error reporting to Slack
app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN' }))
app.listen(3000)
```

## API

```js
const errorToSlack = require('express-error-slack')
```

### errorToSlack(options)

Create a error handling middleware to send error reporting to Slack channel.

#### Options

```js
{
  webhookUri: String,
  skip: function (err, req, res) { return false },
  debug: Boolean
}
```

- `webhookUri`: Required. Your Slack webhook uri that the channel will receive error reporting.
- `skip`: Optional. A function to determine if handler is skipped. Defaults to always returning `false`.
- `debug`: Optional. Show logging of response from Slack if set true. Defaults to `false`.

## Result Example

### 4xx

![Slack Message](https://github.com/chunkai1312/express-error-slack/raw/master/screenshots/4xx.png)

### 5xx

![Slack Message](https://github.com/chunkai1312/express-error-slack/raw/master/screenshots/5xx.png)

## License

MIT © [Chun-Kai Wang](https://github.com/chunkai1312)

[npm-image]: https://img.shields.io/npm/v/express-error-slack.svg
[npm-url]: https://npmjs.org/package/express-error-slack
[travis-image]: https://img.shields.io/travis/chunkai1312/express-error-slack.svg
[travis-url]: https://travis-ci.org/chunkai1312/express-error-slack
[codecov-image]: https://img.shields.io/codecov/c/github/chunkai1312/express-error-slack.svg
[codecov-url]: https://codecov.io/gh/chunkai1312/express-error-slack
