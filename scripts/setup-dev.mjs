
import * as docker from 'docker-compose';
import waiton from 'wait-on';
import { loadEnvironmentVariables, delay } from './utility.mjs'

console.log("Dev Setup Script - Not Implemented");

//Initialise the environment config
loadEnvironmentVariables();

// if (process.env.API_DOCUMENTSTORE && process.env.API_DOCUMENTSTORE.toLowerCase() === "arcadedb") {
//   const opts = {
//     config: "docker/docker-compose-dev.yml"
//   };

//   console.log("Pull arcadedb image");

//   await docker.pullOne("arcadedb", opts);

//   console.log("Stop arcadedb if running");

//   await docker.down({ composeOptions: ["-f", "docker/docker-compose-dev.yml"] });

//   console.log("Wait for resources");
//   await delay(4000, () => console.log("Wait for a couple of seconds to allow resources to be free."))
//   await waiton({ resources: ["tcp:2480", "tcp:2424"], reverse: true, timeout: 5000 })

//   console.log("Run arcadedb for dev");
//   const x = await docker.upAll({ composeOptions: ["-f", "docker/docker-compose-dev.yml"] });

//   console.log(x);

// }

