#!/usr/bin/env node

import * as program from "commander";
import * as ProgressBar from "progress";
import { mkdirSync, readFile, writeFile, exists, constants, truncateSync } from "fs";
import { exec, spawnSync, spawn } from 'child_process';
const beautify = require("json-beautify");

process.title = '@euglena/cli';

var child;

// executes `pwd`
program
    .version('0.0.1');

let typelist = "Here is the supported types : \n\n" +
    "\tnode     generates a Nodejs Application\n" +
    "\tangular  generates an Angular Application\n";

program
    .command('new <name>')
    .alias('n')
    .description('generate a new Euglena structed application')
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action(function (name, options) {
        let barOpts = {
            width: 20,
            total: 100,
            clear: true
        };
        let bar = new ProgressBar(' generating [:bar] :percent :etas', barOpts);
        switch (options.type) {
            case "node":
                bar.tick(10);
                console.log("Generating directory structure.");
                mkdirSync(name);
                bar.tick(20);
                //copy sample files into new app folder
                console.log("Copying files into the new project.");
                let c = exec('cp -r ' + __dirname + '/node/** ' + name, (err, stdout, stderr) => {
                    if (err) console.error(err);
                });
                c.on('error', (err) => console.log(err));
                bar.tick(40);
                let child = spawn('npm', ['init'], { cwd: name, });
                child.stdout.setEncoding('utf-8');
                child.stdout.on("data", (data: any) => {
                    if (data && data.includes("Is this ok? (yes)")) {
                        child.stdin.write("yes");
                        child.stdin.emit("finish");
                        console.log("package.json has been successfully generated");
                        process.stdin.emit("finish");
                        waitPackage_jsonToBeCreated(name, () => {
                            //Inserting dependencies into pacakge.json
                            readFile(name + "/package.json", "utf-8", (err, text) => {
                                let json = JSON.parse(text);
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
                                writeFile(name + "/package.json", text, { "encoding": "utf-8" }, err_back);
                            });
                            //Insert euglenaName into file particles.ts
                            readFile(name + "/src/particles.ts", "utf-8", (err, data) => {
                                data = data.replace('$myself', name);
                                writeFile(name + "/src/particles.ts", data, { "encoding": "utf-8" }, err_back);
                            });
                        });

                    } else {
                        console.log(data);
                    }
                });
                child.stderr.on("data", (data) => {
                    console.error(data);
                });
                process.stdin.pipe(child.stdin);
                break;
            case "angular":
                ///TODO
                break;
        }
    });

program.parse(process.argv);

function err_back(err: Error) { if (err) console.log(err) }

function waitPackage_jsonToBeCreated(name: string, next: () => void) {
    exists(name + "/package.json", x => {
        if (x) {
            next();
        } else {
            console.log("waiting for " + name + "/package.json");
            setTimeout(() => waitPackage_jsonToBeCreated(name, next), 500);
        }
    });
}