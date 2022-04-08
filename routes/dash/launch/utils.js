var { con } = require("../../../db");
const fs = require("fs");
const { exec } = require("child_process");
const yaml = require("yaml");

const wordpress = (u) => {
  return {
    build: {
      context: ".",
    },
    image: "wordcus",
    restart: "always",
    environment: [
      "WORDPRESS_DB_HOST=" + u + "db",
      "WORDPRESS_DB_USER=" + u,
      "WORDPRESS_DB_PASSWORD=lah2525",
      "WORDPRESS_DB_NAME=" + u + "siraj",
      "VIRTUAL_HOST=" + u + ".example1.test",
    ],
    volumes: [u + "wpv:/var/www/html"],
    container_name: u + "wp",
  };
};
const mysqli = (u) => {
  return {
    image: "mysql:5.7",
    restart: "always",
    environment: [
      "MYSQL_DATABASE=" + u + "siraj",
      "MYSQL_USER=" + u,
      "MYSQL_PASSWORD=lah2525",
      "MYSQL_RANDOM_ROOT_PASSWORD=1",
    ],
    volumes: [u + "dbv:/var/lib/mysql"],
    container_name: u + "db",
  };
};
const run = () => {
  con.query("select * from clients where approuved=true", (err, result) => {
    const jsonYaml = {
      version: "2.2",
      services: {
        reverseProxy: {
          image: "jwilder/nginx-proxy",
          restart: "always",
          ports: ["80:80"],
          volumes: ["/var/run/docker.sock:/tmp/docker.sock:ro"],
        },
      },
      volumes: {},
    };
    for (var i = 0; i < result.length; i++) {
      var u = result[i].username;
      jsonYaml.services[u + "wp"] = wordpress(u);
      jsonYaml.services[u + "db"] = mysqli(u);
      jsonYaml.volumes[u + "wpv"] = "";
      jsonYaml.volumes[u + "dbv"] = "";
    }
    const doc = new yaml.Document();
    doc.contents = jsonYaml;

    fs.writeFileSync("dockerCompose/dock.yaml", doc.toString(), (err) => {
      if (err) throw err;
      console.log("docker compose created ");
    });
    if (result.length > 0) {
      // exec(
      //   "docker-compose -f ./dockerCompose/dock.yaml up -d",
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       console.log(`error: ${error.message}`);
      //       return;
      //     }
      //     if (stderr) {
      //       console.log(`stderr: ${stderr}`);
      //       return;
      //     }
      //     console.log(`stdout: ${stdout}`);
      //   }
      // );
    }
  });
};
module.exports.wordpress = wordpress;
module.exports.mysqli = mysqli;
module.exports.run = run;
