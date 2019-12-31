'use strict'

const express = require('express')
const Slack = require('slack-node')
const createError = require('http-errors')
const request = require('supertest')
const { expect } = require('chai')
const sinon = require('sinon')
const errorToSlack = require('../lib')

describe('Express Error Slack', () => {
  const spy = sinon.spy(Slack.prototype, 'webhook')

  beforeEach(() => {
    spy.reset()
  })

  it('should throw error if options not a object', () => {
    expect(() => errorToSlack(false)).to.throw(Error)
  })

  it('should throw error if missing webhookUri', () => {
    expect(() => errorToSlack({})).to.throw(Error)
  })

  it('should throw error if webhookUri not a string', () => {
    expect(() => errorToSlack({ webhookUri: false })).to.throw(Error)
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

  it('should skip to send error to slack if options.skip returns true', (done) => {
    const app = express()
    app.use((req, res, next) => next(createError(404)))
    app.use(errorToSlack({
      webhookUri: 'https://hooks.slack.com/services/TOKEN',
      skip: (err, req, res) => err.status === 404
    }))

    request(app)
      .get('/')
      .expect(404)
      .end((err, res) => {
        expect(err).to.not.exist
        expect(spy.calledOnce).to.be.false
        done()
      })
  })
})
