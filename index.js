#!/usr/bin/env node

'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const querystring = require('querystring')
const request = require('request')

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')

const server = http.createServer((req, response) => {
  req.on('data', (_) => {})

  req.on('end', () => {
    response.writeHead(200, { 'Content-Type': 'text/html' })

    const params = querystring.parse(req.url.slice(2))
    if (params.code == null || params.client_id == null || params.client_secret == null) {
      return response.end(html)
    }

    const options = {
      url: 'https://login.salesforce.com/services/oauth2/token',
      method: 'post',
      form: {
        ...params,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:1234/'
      }
    }
    request(options, (err, _, body) => {
      if (err == null) {
        response.end(JSON.stringify(JSON.parse(body), null, '  '))
      } else {
        response.end(err)
      }
    })
  })
})
server.listen('1234', 'localhost')
console.log('Server running at http://localhost:1234')
