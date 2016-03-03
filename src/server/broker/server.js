"use strict";

var mqtt = require("mqtt");
var child_process = require("child_process");
var constants = require("../config/constants");

class Broker {

  constructor() {
    this.children = [];
  }

  init() {
    this.client = mqtt.connect(constants.mqtt.URL);
    this.client.on(constants.mqtt.CONNECT_TOPIC, () => {
			this.outputText("Broker connected to MQTT");
      this.client.subscribe(constants.mqtt.SPAWN_EMAIL_SERVICE_TOPIC, {qos: 2});
      this.client.subscribe(constants.mqtt.SPAWN_SMS_SERVICE_TOPIC, {qos: 2});
		});  	
    this.client.on(constants.mqtt.MESSAGE_TOPIC, (topic, payload) => {
      this.onTopicReceived(topic, payload);
    });
  }

  outputText(text) {
    process.stdout.write(text + "\n");
  }

  onTopicReceived(topic, payload) {
    if (topic === constants.mqtt.SPAWN_EMAIL_SERVICE_TOPIC) {
      if (this.children.find((c) => c.name === "emailer")) return;
      let child = child_process.spawn("node",
        ["emailer/server.js", payload],
      {
        stdio: ["inherit"], encoding: "utf8"
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      this.children.push({name: "emailer", child: child});
    }
    else if (topic === constants.mqtt.SPAWN_SMS_SERVICE_TOPIC) {
      if (this.children.find((c) => c.name === "sms")) return;
      let child = child_process.spawn("node",
        ["sms/server.js", payload],
      {
        stdio: ["inherit"], encoding: "utf8"
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      this.children.push({name: "sms", child: child});
    }
  }
}

process.title = "dc-Broker";

let broker = new Broker();
broker.init();
