const nodemailer = require("nodemailer");

const SendEmailUsingNodeMailer = async (_Email) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    const _SmtpService = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ccall4496@gmail.com", // generated ethereal user
        pass: "sorryyar1", // generated ethereal password
      },
    });

    //Email Object

    const _EmailObject = {
      from: "ccall4496@gmail.com", // sender address
      to: _Email, // list of receivers
      subject: "imran farhat", // Subject line
      html: `<b>
    <div style="font-family: serif;">
     We welcome you my company!
<br>
Welcome to NodeJs <h4>imranfarhat<h4>
    </div>

    </b>`, // html body
    };

    // Send Email

    const _SendEmail = await _SmtpService.sendMail(_EmailObject);
    return {
      Message: `Important Information Has been found sucessfull from ${_SendEmail.envelope.from} To ${_SendEmail.envelope.to} Please Check Your Email!`,
      Data: _SendEmail.messageId,
      Result: _SendEmail.response,
    };
  } catch (error) {
    return {
      Message: error.message,
      Data: false,
      Result: null,
    };
  }
};

module.exports = { SendEmailUsingNodeMailer };
