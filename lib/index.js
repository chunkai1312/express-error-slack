'use strict'

const sendError = require('./send-error')

function errorToSlack (options) {
  options = Object.assign({
    webhookUri: null,
    skip: (/* err, req, res */) => false,
    debug: false
  }, options)

  if (typeof options.webhookUri !== 'string') {
    throw new Error('Expected webhookUri to be a string')
  }

  return function (err, req, res, next) {
    if (!(err instanceof Error)) {
      // In case a number or other primitive is thrown
      err = new Error(err)
    }

    err.status = err.status || 500

    if (options.skip(err, req, res)) {
      return next(err)
    }

    // send error report to slack
    sendError(options, err, req, (error, response) => {
      if (options.debug) {
        console.log(response)
        if (error) console.error(error)
      }
    })

    next(err)
  }
}

errorToSlack.sendErrorToSlack = sendError

module.exports = errorToSlack
