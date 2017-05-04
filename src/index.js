#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var ProgressBar = require("progress");
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var beautify = require("json-beautify");
process.title = '@euglena/cli';
var child;
// executes `pwd`
program
    .version('0.0.1');
var typelist = "Here is the supported types : \n\n" +
    "\tnode     generates a Nodejs Application\n" +
    "\tangular  generates an Angular Application\n";
program
    .command('new <name>')
    .alias('n')
    .description('generate a new Euglena structed application')
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action(function (name, options) {
    var barOpts = {
        width: 20,
        total: 100,
        clear: true
    };
    var bar = new ProgressBar(' generating [:bar] :percent :etas', barOpts);
    switch (options.type) {
        case "node":
            bar.tick(10);
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            bar.tick(20);
            //copy sample files into new app folder
            console.log("Copying files into the new project.");
            var c = child_process_1.exec('cp -r ' + __dirname + '/node/** ' + name, function (err, stdout, stderr) {
                if (err)
                    console.error(err);
            });
            c.on('error', function (err) { return console.log(err); });
            bar.tick(40);
            var child_1 = child_process_1.spawn('npm', ['init'], { cwd: name });
            child_1.stdout.setEncoding('utf-8');
            child_1.stdout.on("data", function (data) {
                if (data && data.includes("Is this ok? (yes)")) {
                    child_1.stdin.write("yes");
                    child_1.stdin.emit("finish");
                    console.log("package.json has been successfully generated");
                    process.stdin.emit("finish");
                    waitPackage_jsonToBeCreated(name, function () {
                        //Inserting dependencies into pacakge.json
                        fs_1.readFile(name + "/package.json", "utf-8", function (err, text) {
                            var json = JSON.parse(text);
                            json.scripts.build = "tsc -p .";
                            json.scripts.start = "node ./src/index.js";
                            json.main = "src/index.js";
                            json.dependencies = {
                                "@euglena/core": "0.1.0",
                                "@euglena/template": "0.0.7",
                                "euglena.organelle.time.js": "0.0.2",
                                "jsonminify": "^0.4.1"
                            };
                            json.devDependencies = {
                                "@types/node": "^7.0.14"
                            };
                            text = beautify(json, null, 2, 10);
                            fs_1.writeFile(name + "/package.json", text, { "encoding": "utf-8" }, err_back);
                        });
                        //Insert euglenaName into file particles.ts
                        fs_1.readFile(name + "/src/particles.ts", "utf-8", function (err, data) {
                            data = data.replace('$myself', name);
                            fs_1.writeFile(name + "/src/particles.ts", data, { "encoding": "utf-8" }, err_back);
                        });
                    });
                }
                else {
                    console.log(data);
                }
            });
            child_1.stderr.on("data", function (data) {
                console.error(data);
            });
            process.stdin.pipe(child_1.stdin);
            break;
    }
});
program.parse(process.argv);
function err_back(err) { if (err)
    console.log(err); }
function waitPackage_jsonToBeCreated(name, next) {
    fs_1.exists(name + "/package.json", function (x) {
        if (x) {
            next();
        }
        else {
            console.log("waiting for " + name + "/package.json");
            setTimeout(function () { return waitPackage_jsonToBeCreated(name, next); }, 500);
        }
    });
}
