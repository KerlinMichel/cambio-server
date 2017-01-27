require('dotenv').config()
var Imap = require('imap')
var inspect = require('util').inspect
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

var imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_HOST,
  port: 993,
  tls: true
})

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

imap.once('ready', () => {
  console.log('Imap ready')
  var iid = setInterval(() => {
    openInbox((err, box) => {
      if(err) throw err
      imap.search(['UNSEEN'], (err, emails) => {
        var f = imap.fetch(emails, {
          bodies: ['TEXT'],//HEADER.FIELDS (FROM TO SUBJECT DATE)
          struct: true
        })
        f.on('message', function(msg, seqno) {
          //console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function(stream, info) {
            var buffer = '';
            var count = 0;
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
              count += chunk.length;
              //console.log(info.which)
              //console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            });
            stream.once('end', function() {
              //console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              console.log('end me')
              var bufferLines = buffer.split(/\r?\n/)
              var emailText = bufferLines.slice(3, bufferLines.length-7)
              //emailOptions.text = emailText
              //sendEmail(emailText)
              //.then(() => console.log('send'))
              //.catch((err) => console.log(err))
            })
          });
          msg.once('attributes', function(attrs) {
            //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            //imap.addFlags(attrs.uid, '\\Deleted', function() {console.log(err)})
          });
          msg.once('end', function() {
            console.log(prefix + 'Finished');
          })
        })
        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
        })
        f.once('end', function() {
          console.log('Done fetching all messages!');
          //clearInterval(iid)
          //imap.end();
        })
      })
    })
  }, 3000)
})

function sendEmail(emailText) {
  emailOptions.text = emailText
  return new Promise((res, rej) => {
    transporter.sendMail(emailOptions, function(error, info) {
      console.log('Email callback');
      if(error) {
        rej(error);
      }
      res()
      console.log('Message sent');
    })
    console.log(emailText);
  })
}

imap.connect()
