// Need to enable the following link when using gmail:
// https://www.google.com/settings/security/lesssecureapps

"use strict";

var mqtt = require("mqtt");
var nodemailer = require("nodemailer");
var constants = require("../config/constants");

class SMS {

  constructor() {
    this.transporter = this.getMailTransport();
    this.mailOptions = {
      from: constants.mail.from,
      to: '',
      subject: 'SMS Text',
      text: '',
      html: ''
    };
  }

  init() {
    this.client = mqtt.connect(constants.mqtt.URL);
    this.client.on(constants.mqtt.CONNECT_TOPIC, () => {
			this.outputText("SMS connected to MQTT");
      this.client.subscribe(constants.mqtt.SMS_TOPIC, {qos: 2});
		});  	
    this.client.on("message", (topic, payload) => {
      if (topic === constants.mqtt.SMS_TOPIC) {
        this.outputText("Payload - " + payload)
        this.onSendSMS(payload);
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

  onSendSMS(payload) {
    let json = JSON.parse(payload);
    this.mailOptions.to = this.buildCarrierAddresses(json.to);
    this.mailOptions.subject = json.subject;
    this.mailOptions.text = json.text;
    this.outputText("sms options: " + JSON.stringify(this.mailOptions));
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if(error){
        return console.log(error);
      }
      this.outputText('Message sent: ' + info.response);
    });    
  }

  buildCarrierAddresses(mobileNumber) {
    var ATT = `${mobileNumber}@txt.att.net`;
    // var METRO = `${mobileNumber}@mymetropcs.com`;  // TMOBILE bought METRO
    var TMOBILE = `${mobileNumber}@tmomail.net`;
    var CLEARTALK = `${mobileNumber}@sms.cleartalk.us`;
    var QWEST = `${mobileNumber}@qwestmp.com`;
    var SPRINT = `${mobileNumber}@messaging.sprintpcs.com`;
    var VERIZON = `${mobileNumber}@vtext.com`;
    var textAddress = `${ATT}, ${TMOBILE}, ${CLEARTALK}, ${QWEST}, ${SPRINT}, ${VERIZON}`; 
    return textAddress;
  }

  outputText(text) {
    process.stdout.write(text + "\n");
  }  

}

process.title = "dc-SMS";

let sms = new SMS();
sms.init();
