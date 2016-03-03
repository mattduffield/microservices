"use strict";

var mqtt = require("mqtt");
var constants = require("../config/constants");

/**
 * Logger filters out status messages to reduce noise in terminal window.
 * See onTopicReceived below to enable status messages or filter additional messages.
 */
class Logger {

  run() {
    this.client = mqtt.connect(constants.mqtt.URL);
    this.client.on(constants.mqtt.CONNECT_TOPIC, () => {
      this.outputText("Logger connected to MQTT");
      this.client.subscribe(constants.mqtt.CONNECTED_TOPIC, {qos: 2});
      this.client.subscribe(constants.mqtt.ALL_TOPICS, {qos: 2});
    });

    this.client.on(constants.mqtt.MESSAGE_TOPIC, (topic, payload) => {
      this.onTopicReceived(topic, payload);
    });
  }

  onTopicReceived(topic, payload) {
    if (topic.indexOf("status") === -1) {
      this.outputText(`Log: ${topic}  Payload: ${payload}`);
    }
  }

  outputText(text) {
    process.stdout.write(text + "\n");
  }
}

process.title = "dc-Logger";

let logger = new Logger();
logger.run();
