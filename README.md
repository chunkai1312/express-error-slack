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
app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN'})
```

## License

MIT © [Chun-Kai Wang](https://github.com/chunkai1312)

[npm-image]: https://img.shields.io/npm/v/express-error-slack
[npm-url]: https://npmjs.org/package/express-error-slack
[travis-image]: https://img.shields.io/travis/chunkai1312/express-error-slack.svg
[travis-url]: https://travis-ci.org/chunkai1312/express-error-slack
[codecov-image]: https://img.shields.io/codecov/c/github/chunkai1312/express-error-slack.svg
[codecov-url]: https://codecov.io/gh/chunkai1312/express-error-slack