exports.mqtt = {
	URL: "mqtt://localhost:1883",
	CONNECT_TOPIC: "connect", 
	MESSAGE_TOPIC: "message",
	CONNECTED_TOPIC: "dc/connected",
	ALL_TOPICS: "dc/#",
	LOGGER_TOPIC: "",
	SPAWN_EMAIL_SERVICE_TOPIC: "dc/email",
	EMAIL_TOPIC: "dc/send-email",
	SPAWN_SMS_SERVICE_TOPIC: "dc/sms",
	SMS_TOPIC: "dc/send-sms"
};
exports.mail = { 
  user: "trd.hydra@gmail.com",
  pass: "h@1lhydr@",
  from: '"TRD Support" <trd.hydra@gmail.com>'
};