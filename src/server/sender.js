"use strict";

var mqtt = require("mqtt");
var config = require("../config/global");

class Sender {

  init() {
    this.client = mqtt.connect(config.mqtt.URL);
    this.client.on(config.mqtt.CONNECT_TOPIC, () => {
      setTimeout(() => {
        process.stdout.write("publishing..." + "\n");
        this.client.publish(config.mqtt.CONNECTED_TOPIC, 'Sender is now connected');
      },250);
		});  	
  }
}

process.title = "dc-Sender";

let sender = new Sender();
sender.init();
