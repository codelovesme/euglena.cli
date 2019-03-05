#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const program = require("commander");
const ProgressBar = require("progress");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const beautify = require("json-beautify");
const packageJson = require('../package.json');
process.title = '@euglena/cli';
var child;
var isWin = /^win/.test(process.platform);
// executes `pwd`
program
    .version(packageJson.version);
let typelist = "Here is the supported types : \n\n" +
    "\t node     generates a Nodejs Application\n" +
    "\t react     generates a Reactjs Application\n" +
    "\t angular  generates an Angular Application\n";
function npm_install(name) {
    console.log("installing dependencies...");
    let child = child_process_1.spawn(isWin ? 'npm.cmd' : 'npm', ['install'], { cwd: name });
    child.on("exit", () => console.log("done."));
}
program
    .command('new <name>')
    .alias('n')
    .description('generate a new Euglena structed application')
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action((name, options) => {
    let barOpts = {
        width: 20,
        total: 100,
        clear: true
    };
    let bar = new ProgressBar(' generating [:bar] :percent :etas', barOpts);
    let templateFolder = path.join(__dirname, "../src", options.type);
    let packageFile = "";
    let child_process;
    let particlesTsFile = "";
    switch (options.type) {
        case "react":
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + ' /i /e' : 'cp -a ' + templateFolder + '/ ' + name + "/", (err, stdout, stderr) => {
                if (err)
                    console.error(err);
            });
            child_process.on('error', (err) => console.log(err));
            break;
        case "organelle":
            //bar.tick(10);
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            //bar.tick(20);
            //copy sample files into new app folder
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + ' /i /e' : 'cp -a ' + templateFolder + '/ ' + name + "/", (err, stdout, stderr) => {
                if (err)
                    console.error(err);
            });
            child_process.on('error', (err) => console.log(err));
            //bar.tick(40);
            /**
             *  Wait for the package.json
             */
            packageFile = name + "/package.json";
            waitForPathToBeCreated(packageFile).then(() => {
                //Inserting dependencies into pacakge.json
                fs_1.readFile(name + "/package.json", "utf-8", (err, text) => {
                    let json = JSON.parse(text);
                    json.scripts.test = "gulp test";
                    json.scripts.build = "gulp build";
                    json.scripts.start = "gulp buildAndTest && gulp watch";
                    json.main = ".dist/src/index.js";
                    json.typings = ".dist/src/index.d.ts";
                    json.dependencies = {
                        "cessnalib": "^0.7.0",
                        "@euglena/core": "^0.1.7",
                        "@euglena/template": "^2.0.0",
                        "@euglena/organelle.time.js": "^0.1.0",
                        "jsonminify": "^0.4.1"
                    };
                    json.devDependencies = {
                        "@types/chai": "^4.0.10",
                        "@types/node": "^7.0.14",
                        "@types/mocha": "^2.2.40",
                        "gulp": "github:gulpjs/gulp#4.0",
                        "gulp-mocha": "^4.3.1",
                        "gulp-typescript": "^3.0.1",
                        "typescript": "^2.3.3",
                        "gulp-sourcemaps": "^2.6.1",
                        "merge2": "^1.2.0",
                        "chai": "^4.1.2",
                    };
                    json.files = [
                        ".dist/src/*"
                    ];
                    text = beautify(json, null, 2, 10);
                    fs_1.writeFile(packageFile, text, { "encoding": "utf-8" }, (err) => {
                        err_back(err, packageFile + " has been updated.");
                        /**
                         *  install dependencies
                         *  run npm install
                         */
                        npm_install(name);
                    });
                });
            });
            /**
             * Generate package.json
             */
            child_process_1.spawn(isWin ? 'npm.cmd' : 'npm', ['init', '--force'], { cwd: name });
            break;
        case "node":
            //bar.tick(10);
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            //bar.tick(20);
            //copy sample files into new app folder
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + ' /i /e' : 'cp -a ' + templateFolder + '/ ' + name + "/", (err, stdout, stderr) => {
                if (err)
                    console.error(err);
            });
            child_process.on('error', (err) => console.log(err));
            //bar.tick(40);
            /**
             *  Wait for the package.json
             */
            packageFile = name + "/package.json";
            waitForPathToBeCreated(packageFile).then(() => {
                //Inserting dependencies into pacakge.json
                fs_1.readFile(name + "/package.json", "utf-8", (err, text) => {
                    let json = JSON.parse(text);
                    json.scripts.test = "mocha .dist/test/index.js";
                    json.scripts.build = "gulp build";
                    json.scripts.deploy = "gulp deploy";
                    json.scripts.start = "npm run build && npm test && node .";
                    json.main = ".dist/src/index.js";
                    json.dependencies = {
                        "cessnalib": "^0.2.0",
                        "@euglena/core": "0.1.7",
                        "@euglena/template": "2.0.3",
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
                    fs_1.writeFile(packageFile, text, { "encoding": "utf-8" }, (err) => {
                        err_back(err, packageFile + " has been updated.");
                        /**
                         *  install dependencies
                         *  run npm install
                         */
                        npm_install(name);
                    });
                });
            });
            /**
             * Generate package.json
             */
            child_process_1.spawn(isWin ? 'npm.cmd' : 'npm', ['init', '--force'], { cwd: name });
            /**
             * Wait for the particles.ts
             */
            particlesTsFile = name + "/src/particles.ts";
            waitForPathToBeCreated(particlesTsFile).then(() => {
                fs_1.readFile(particlesTsFile, "utf-8", (err, data) => {
                    data = data.replace('$myself', name);
                    fs_1.writeFile(particlesTsFile, data, { "encoding": "utf-8" }, (err) => {
                        err_back(err, particlesTsFile + " has been updated.");
                    });
                });
            });
            break;
        case "angular":
            let child2 = child_process_1.spawn('node', [__dirname + "/../node_modules/@angular/cli/bin/ng", "new", name]);
            child2.stdout.setEncoding('utf-8');
            child2.stdout.on("data", (data) => {
                console.log(data);
            });
            child2.stderr.setEncoding('utf-8');
            child2.stderr.on("data", (data) => {
                console.error(data);
                process.abort();
            });
            waitForPathToBeCreated(name + "/package.json").then(() => {
                //Inserting dependencies into pacakge.json
                fs_1.readFile(name + "/package.json", "utf-8", (err, text) => {
                    let json = JSON.parse(text);
                    json.dependencies["cessnalib"] = "^0.7.0";
                    json.dependencies["@euglena/core"] = "^0.1.7";
                    json.dependencies["@euglena/template"] = "^2.2.0";
                    json.dependencies["@euglena/organelle.time.js"] = "^0.1.0";
                    text = beautify(json, null, 2, 10);
                    fs_1.writeFile(name + "/package.json", text, { "encoding": "utf-8" }, (err) => {
                        err_back(err, "package.json has been updated!");
                        npm_install(name);
                    });
                });
            });
            waitForPathToBeCreated([name + "/src/app/app.component.ts", name + "/src/app/app.module.ts"]).then(() => {
                //Copying file 
                console.log("Copying files into the new project.");
                child_process_1.exec(isWin ? 'xcopy ' + templateFolder + ' ' + name + '/src /i /e' : 'cp -a ' + templateFolder + '/ ' + name + "/src/", (err, stdout, stderr) => {
                    if (err)
                        console.error(err);
                });
            });
            particlesTsFile = name + "/src/euglena/particles.ts";
            waitForPathToBeCreated(particlesTsFile).then(() => {
                fs_1.readFile(particlesTsFile, "utf-8", (err, data) => {
                    data = data.replace('$myself', name);
                    fs_1.writeFile(particlesTsFile, data, { "encoding": "utf-8" }, (err) => {
                        err_back(err, particlesTsFile + " has been updated.");
                    });
                });
            });
            break;
    }
});
program.parse(process.argv);
function err_back(err, success) {
    if (err)
        console.log(err);
    else if (success)
        console.log(success);
}
function waitForPathToBeCreated(path) {
    if (path instanceof Array) {
        let promises = [];
        for (let p of path) {
            promises.push(waitForPathToBeCreated(p));
        }
        return Promise.all(promises);
    }
    else {
        return new Promise((next, reject) => {
            fs_1.exists(path, x => {
                if (x) {
                    next();
                }
                else {
                    console.log("waiting for " + path + " to be created.");
                    setTimeout(() => waitForPathToBeCreated(path).then(next), 500);
                }
            });
        });
    }
}
//# sourceMappingURL=index.js.map