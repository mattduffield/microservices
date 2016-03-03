"use strict";

var mqtt = require("mqtt");
var constants = require("../config/constants");

class Sender {

  init() {
    this.client = mqtt.connect(constants.mqtt.URL);
    this.client.on(constants.mqtt.CONNECT_TOPIC, () => {
      setTimeout(() => {
        process.stdout.write("publishing..." + "\n");
        this.client.publish(constants.mqtt.CONNECTED_TOPIC, 'Sender is now connected');
      },250);
		});  	
  }
}

process.title = "dc-Sender";

let sender = new Sender();
sender.init();
