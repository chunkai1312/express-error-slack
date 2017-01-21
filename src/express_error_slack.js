import Slack from 'slack-node'
import { extend, isEmpty } from 'lodash'

function sendErrorToSlack (webhookUri, err, req) {
  const slack = new Slack()
  slack.setWebhook(webhookUri)

  const request = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body || {}
  }

  const attachment = extend({}, {
    fallback: `${err.name}: ${err.message}`,
    color: (err.status < 500) ? 'warning' : 'danger',
    author_name: req.headers.host,
    title: `${err.name}: ${err.message}`,
    fields: [
      { title: 'Request URL', value: req.url, short: true },
      { title: 'Request Method', value: req.method, short: true },
      { title: 'Status Code', value: err.status, short: true },
      { title: 'Remote Address', value: getRemoteAddress(req), short: true }
    ],
    text: [
      { title: 'Stack', code: err.stack },
      { title: 'Request', code: request }
    ].map(data => createCodeBlock(data.title, data.code)).join(''),
    mrkdwn_in: ['text'],
    footer: 'express-error-slack',
    ts: parseInt(Date.now() / 1000)
  })

  slack.webhook({ attachments: [attachment] }, (error, response) => { if (error) console.error(error) })
}

function getRemoteAddress (req) {
  return req.ip ||
    req._remoteAddress ||
    (req.connection && req.connection.remoteAddress) ||
    undefined
}

function createCodeBlock (title, code) {
  if (isEmpty(code)) return ''
  code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2)
  const tripleBackticks = '```'
  return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`
}

export default function (options) {
  if (typeof options !== 'object' || typeof options.webhookUri !== 'string') {
    throw Error('Missing webhookUri')
  }

  return function (err, req, res, next) {
    err.status = err.status || 500
    sendErrorToSlack(options.webhookUri, err, req)
    next(err)
  }
}
