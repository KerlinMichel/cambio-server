var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport('SMTP', {
  host: process.env.IMAP_HOST,
  auth: {
     user: process.env.IMAP_USER,
     pass: process.env.IMAP_PASSWORD
  },
  port: 587
});

var emailOptions = {
  from: '"Fred Foo ?" <kerlin@box.kerlin.tech>', // sender address
  to: 'user@box.kerlin.tech', // list of receivers
  subject: 'Cambio', // Subject line
  //text: 'Hello world ?', // plaintext body
  html: '<b>Hello world ?</b>' // html body
}

var express = require('express')
