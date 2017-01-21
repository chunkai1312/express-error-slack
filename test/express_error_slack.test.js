import express from 'express'
import Slack from 'slack-node'
import createError from 'http-errors'
import request from 'supertest'
import { expect } from 'chai'
import sinon from 'sinon'
import errorToSlack from '../src/express_error_slack'

describe('Express Error Slack', () => {
  const spy = sinon.spy(Slack.prototype, 'webhook')

  beforeEach(() => {
    spy.reset()
  })

  it('should throw error if missing webhookUri', () => {
    const app = express()
    try {
      app.use(errorToSlack())
    } catch (err) {
      expect(err).to.exist
      expect(err.message).to.equal('Missing webhookUri')
    }
  })

  it('should send error to slack for status code 4xx', (done) => {
    const app = express()
    app.use((req, res, next) => next(createError(400)))
    app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN' }))

    request(app)
      .get('/')
      .expect(400)
      .end((err, res) => {
        expect(err).to.not.exist
        expect(spy.calledOnce).to.be.true
        expect(spy.args[0][0].attachments[0]).to.have.property('color', 'warning')
        done()
      })
  })

  it('should send error to slack for status code 5xx', (done) => {
    const app = express()
    app.use((req, res, next) => next(createError(500)))
    app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN' }))

    request(app)
      .get('/')
      .expect(500)
      .end((err, res) => {
        expect(err).to.not.exist
        expect(spy.calledOnce).to.be.true
        expect(spy.args[0][0].attachments[0]).to.have.property('color', 'danger')
        done()
      })
  })
})
