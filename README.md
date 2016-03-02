# microservices
This is a sample using MQTT

## Installation Steps

1. install mosquitto from http://mosquitto.org/download/
2. open a terminal window and navigate to where your cloned this repository
3. `npm install`
4. open another terminal window
5. `/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf`
6. go to first terminal window
7. `cd src/server`
8. `node server.js`

## Testing the MQTT services
Open a terminal window and proceed with either of the scenarios. Keep the terminal window where node is running the server to see the stdout messages.

### Sending an email
```
mosquitto_pub -t dc/email -m "get emailer ready"
mosquitto_pub -t dc/send-email -m '{"to": "<ENTER EMAIL ADDRESS>", "subject":"Test Email","text":"hello world"}'
```

### Sending a text
```
mosquitto_pub -t dc/sms -m "get sms ready"
mosquitto_pub -t dc/send-sms -m '{"to":"<ENTER PHONE NUMBER>","text":"hello mobile"}'
```

## Publishing a Mosquitto topic from Commandline

```
mosquitto_pub -t dc/matt -m "hello world"
```

You need to ensure that you either have a wild card or using a specific topic.

## Subscribing to a Mosquitto topic using a wild card from commandline

```
mosquitto_sub -t dc/#
```