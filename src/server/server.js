// http://www.hacksparrow.com/difference-between-spawn-and-exec-of-node-js-child_process.html
// http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn

"use strict";

process.title = "dc";

let child_process = require("child_process");

try {
  let childBroker = child_process.spawn("node", ["broker/server.js"],
      {stdio: ["inherit"], encoding: "utf8"}
  );
  childBroker.stdout.pipe(process.stdout);
  childBroker.stderr.pipe(process.stderr);
} catch (e) {
    console.log(e);
    process.exit(-1);
}

try {
  let childLogger = child_process.spawn("node", ["logger/server.js"],
      {stdio: ["inherit"], encoding: "utf8"}
  );
  childLogger.stdout.pipe(process.stdout);
  childLogger.stderr.pipe(process.stderr);
} catch (e) {
    console.log(e);
    process.exit(-1);
}
