// Need to enable the following link when using gmail:
// https://www.google.com/settings/security/lesssecureapps

"use strict";

var mqtt = require("mqtt");
var nodemailer = require("nodemailer");
var constants = require("../config/constants");

class Emailer {

  constructor() {
    this.transporter = this.getMailTransport();
    this.mailOptions = {
      from: constants.mail.from,
      to: '',
      subject: '',
      text: '',
      html: ''
    };
  }

  init() {
    this.client = mqtt.connect(constants.mqtt.URL);
    this.client.on(constants.mqtt.CONNECT_TOPIC, () => {
			this.outputText("Emailer connected to MQTT");
      this.client.subscribe(constants.mqtt.EMAIL_TOPIC, {qos: 2});
		});  	
    this.client.on("message", (topic, payload) => {
      if (topic === constants.mqtt.EMAIL_TOPIC) {
        this.outputText("Payload - " + payload)
        this.onSendEmail(payload);
      }
    });
  }

  getMailTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: constants.mail.user,
        pass: constants.mail.pass
      }
    });
  }


  onSendEmail(payload) {
    // let json = JSON.parse('{"subject":"Time to go","text":"hi matt"}');
    let json = JSON.parse(payload);
    this.mailOptions.to = json.to;
    this.mailOptions.subject = json.subject;
    this.mailOptions.text = json.text;
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if(error){
        return console.log(error);
      }
      this.outputText('Message sent: ' + info.response);
    });    
  }

  outputText(text) {
    process.stdout.write(text + "\n");
  }  

}

process.title = "dc-Emailer";

let emailer = new Emailer();
emailer.init();
