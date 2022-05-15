const nodemailer = require('nodemailer')

const sendEmail = options => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f47b4e3cbbe982",
          pass: "ad7b10133c4541"
        }
      });

      const mailOptions = {
          from: options.from,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html
      }

  
    transport.sendMail(mailOptions)
}

module.exports = sendEmail
