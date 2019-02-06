import sendErrorToSlack from './sendErrorToSlack'

export default function (options = {}) {
  if (typeof options !== 'object') {
    throw new Error('Expected options to be a object')
  }

  if (typeof options.webhookUri === 'undefined') {
    throw new Error('Missing webhookUri')
  }

  if (typeof options.webhookUri !== 'string') {
    throw new Error('Expected webhookUri to be a string')
  }

  const webhookUri = options.webhookUri
  const skip = options.skip || false

  return function (err, req, res, next) {
    if (!(err instanceof Error)) {
      // In case a number or other primitive is thrown
      err = new Error(err)
    }

    err.status = err.status || 500

    if (skip !== false && skip(err, req, res)) return next(err)
    sendErrorToSlack(webhookUri, err, req)
    next(err)
  }
}
