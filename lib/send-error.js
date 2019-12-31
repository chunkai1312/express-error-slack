'use strict'

const Slack = require('slack-node')
const { extend, isEmpty } = require('lodash')

function getRemoteAddress (req) {
  return req.headers['x-forwarded-for'] || req.ip || (req.connection && req.connection.remoteAddress)
}

function createCodeBlock (title, code) {
  if (isEmpty(code)) return ''
  code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2)
  const tripleBackticks = '```'
  return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`
}

function sendError (webhookUri, err, req) {
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

module.exports = sendError
