'use strict'

const express = require('express')
const Slack = require('slack-node')
const createError = require('http-errors')
const request = require('supertest')
const expect = require('chai').expect
const sinon = require('sinon')
const errorToSlack = require('../')

describe('Express Error Slack', function () {
  it('should throw error if missing webhookUri', function () {
    const app = express()
    try {
      app.use(errorToSlack())
    } catch (err) {
      expect(err).to.exist
      expect(err.message).to.equal('Missing webhookUri')
    }
  })

  it('should send error to slack for status code 4xx', function () {
    const app = express()
    app.use(function (req, res, next) {
      next(createError(500))
    })
    app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN' }))

    return request(app)
      .get('/')
      .expect(500)
      .end((err, res) => {
        expect(err).to.exist
      })
  })

  it('should send error to slack for status code 5xx', function () {
    var app = express()
    app.use(function (req, res, next) {
      next(createError(400))
    })
    app.use(errorToSlack({ webhookUri: 'https://hooks.slack.com/services/TOKEN' }))

    return request(app.listen())
      .get('/')
      .expect(400)
      .end((err, res) => {
        expect(err).to.exist
      })
  })
})
