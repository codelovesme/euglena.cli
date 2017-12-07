#!/usr/bin/env node

import * as path from "path";
import * as program from "commander";
import * as ProgressBar from "progress";
import { mkdirSync, readFile, writeFile, exists, constants, truncateSync } from "fs";
import { exec, spawnSync, spawn } from 'child_process';
const beautify = require("json-beautify");

process.title = '@euglena/cli';

var child;

var isWin = /^win/.test(process.platform);

// executes `pwd`
program
    .version('0.0.1');

let typelist = "Here is the supported types : \n\n" +
    "\tnode     generates a Nodejs Application\n" +
    "\tangular  generates an Angular Application\n";

function npm_install(name: string) {
    console.log("npm install...");
    let child = exec(isWin ? 'npm.cmd install --prefix "%cd%"/' + name + " ./" + name : 'npm install');
    child.stdout.setEncoding('utf-8');
    child.stderr.setEncoding('utf-8');
    child.stdout.on("data", x => console.log(x));
    child.stderr.on("data", x => console.error(x));
}

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
        let templateFolder = path.join(__dirname, "../src", options.type);
        switch (options.type) {
            case "node":
                //bar.tick(10);
                console.log("Generating directory structure.");
                mkdirSync(name);
                //bar.tick(20);
                //copy sample files into new app folder
                console.log("Copying files into the new project.");
                let c = exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + ' /i /e' : 'cp -r ' + templateFolder + '/** ' + name, (err, stdout, stderr) => {
                    if (err) console.error(err);
                });
                c.on('error', (err) => console.log(err));
                //bar.tick(40);
                /**
                 *  Wait for the package.json
                 */
                let packageFile = name + "/package.json";
                waitForPathToBeCreated(packageFile).then(() => {
                    //Inserting dependencies into pacakge.json
                    readFile(name + "/package.json", "utf-8", (err, text) => {
                        let json = JSON.parse(text);
                        json.scripts.test = "mocha .dist/test/index.js";
                        json.scripts.build = "gulp build";
                        json.scripts.deploy = "gulp deploy";
                        json.scripts.start = "npm run build && npm test && node .";
                        json.main = ".dist/src/index.js";
                        json.dependencies = {
                            "cessnalib": "^0.2.0",
                            "@euglena/core": "0.1.6",
                            "@euglena/template": "1.0.1",
                            "@euglena/organelle.time.js": "^0.1.0",
                            "jsonminify": "^0.4.1"
                        };
                        json.devDependencies = {
                            "@types/node": "^7.0.14",
                            "@types/mocha": "^2.2.40",
                            "gulp": "github:gulpjs/gulp#4.0",
                            "gulp-mocha": "^4.3.1",
                            "gulp-typescript": "^3.0.1",
                            "typescript": "^2.3.3",
                            "child_process": "^1.0.2",
                            "gulp-sourcemaps": "^2.6.1",
                            "merge2": "^1.2.0"
                        };
                        text = beautify(json, null, 2, 10);
                        writeFile(packageFile, text, { "encoding": "utf-8" }, (err) => {
                            err_back(err, packageFile + " has been updated.");
                            /**
                             *  install dependencies
                             *  run npm install
                             */

                            //npm_install(name);    ====> open after this issue closed ====> https://github.com/nathanbuchar/nathanbuchar.com/issues/28
                        });
                    });
                });
                /**
                 * Generate package.json
                 */
                spawn(isWin ? 'npm.cmd' : 'npm', ['init','--force'], { cwd: name });
                /**
                 * Wait for the particles.ts
                 */
                let particlesTsFile = name + "/src/particles.ts";
                waitForPathToBeCreated(particlesTsFile).then(() => {
                    readFile(particlesTsFile, "utf-8", (err, data) => {
                        data = data.replace('$myself', name);
                        writeFile(particlesTsFile, data, { "encoding": "utf-8" }, (err) => {
                            err_back(err, particlesTsFile + " has been updated.");
                        });
                    });
                });
                break;
            case "angular":
                let child2 = spawn('node', [__dirname + "/../node_modules/@angular/cli/bin/ng", "new", name]);
                child2.stdout.setEncoding('utf-8');
                child2.stdout.on("data", (data: any) => {
                    console.log(data);

                });
                child2.stderr.setEncoding('utf-8');
                child2.stderr.on("data", (data) => {
                    console.error(data);
                    process.abort();
                });
                waitForPathToBeCreated(name + "/package.json").then(() => {
                    //Inserting dependencies into pacakge.json
                    readFile(name + "/package.json", "utf-8", (err, text) => {
                        let json = JSON.parse(text);
                        json.dependencies["cessnalib"] = "^0.2.0";
                        json.dependencies["@euglena/core"] = "0.1.6";
                        json.dependencies["@euglena/template"] = "1.0.1";
                        json.dependencies["@euglena/organelle.time.js"] = "^0.1.0";
                        text = beautify(json, null, 2, 10);
                        writeFile(name + "/package.json", text, { "encoding": "utf-8" }, (err) => {
                            err_back(err, "package.json has been updated!");
                            //npm_install(name);    ====> open after this issue closed ====> https://github.com/nathanbuchar/nathanbuchar.com/issues/28
                        });
                    });
                });
                waitForPathToBeCreated([name + "/src/app/app.component.ts", name + "/src/app/app.module.ts"]).then(() => {
                    //Copying file 
                    console.log("Copying files into the new project.");
                    exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + '/src /i /e' : 'cp -r ' + templateFolder + '/** ' + name + "/src", (err, stdout, stderr) => {
                        if (err) console.error(err);
                    });
                });
                particlesTsFile = name + "/src/euglena/particles.ts";
                waitForPathToBeCreated(particlesTsFile).then(() => {
                    readFile(particlesTsFile, "utf-8", (err, data) => {
                        data = data.replace('$myself', name);
                        writeFile(particlesTsFile, data, { "encoding": "utf-8" }, (err) => {
                            err_back(err, particlesTsFile + " has been updated.");
                        });
                    });
                });
                break;
        }
    });

program.parse(process.argv);

function err_back(err: Error, success?: string) {
    if (err) console.log(err)
    else if (success) console.log(success);
}

function waitForPathToBeCreated(path: string | string[]): Promise<{}> {
    if (path instanceof Array) {
        let promises = [];
        for (let p of path) {
            promises.push(waitForPathToBeCreated(p));
        }
        return Promise.all(promises);
    } else {
        return new Promise((next: any, reject: any) => {
            exists(path, x => {
                if (x) {
                    next();
                } else {
                    console.log("waiting for " + path + " to be created.");
                    setTimeout(() => waitForPathToBeCreated(path).then(next), 500);
                }
            });
        });

    }
}