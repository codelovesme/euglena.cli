#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const ProgressBar = require("progress");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
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
            //bar.tick(10);
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            //bar.tick(20);
            //copy sample files into new app folder
            console.log("Copying files into the new project.");
            let c = child_process_1.exec('cp -r ' + __dirname + '/node/** ' + name, (err, stdout, stderr) => {
                if (err)
                    console.error(err);
            });
            c.on('error', (err) => console.log(err));
            //bar.tick(40);
            let child = child_process_1.spawn('npm', ['init'], { cwd: name, });
            child.stdout.setEncoding('utf-8');
            child.stderr.setEncoding('utf-8');
            child.stdout.on("data", (data) => {
                if (data && data.includes("Is this ok? (yes)")) {
                    child.stdin.write("yes");
                    child.stdin.emit("finish");
                    console.log("package.json has been successfully generated");
                    process.stdin.emit("finish");
                    let packageFile = name + "/package.json";
                    waitForPathToBeCreated(packageFile).then(() => {
                        //Inserting dependencies into pacakge.json
                        fs_1.readFile(name + "/package.json", "utf-8", (err, text) => {
                            let json = JSON.parse(text);
                            json.scripts.test = "mocha .dist/test/index.js";
                            json.scripts.build = "gulp build && npm test";
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
                                "gulp": "^3.9.1",
                                "gulp-mocha": "^4.3.1",
                                "gulp-typescript": "^3.0.1",
                                "typescript": "^2.3.3"
                            };
                            text = beautify(json, null, 2, 10);
                            fs_1.writeFile(packageFile, text, { "encoding": "utf-8" }, (err) => {
                                err_back(err, packageFile + " has been updated.");
                            });
                        });
                    });
                    let particlesTsFile = name + "/src/particles.ts";
                    waitForPathToBeCreated(particlesTsFile).then(() => {
                        fs_1.readFile(particlesTsFile, "utf-8", (err, data) => {
                            data = data.replace('$myself', name);
                            fs_1.writeFile(particlesTsFile, data, { "encoding": "utf-8" }, (err) => {
                                err_back(err, particlesTsFile + " has been updated.");
                            });
                        });
                    });
                }
                else {
                    console.log(data);
                }
            });
            child.stderr.on("data", (data) => {
                console.error(data);
            });
            process.stdin.pipe(child.stdin);
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
                    json.dependencies["cessnalib"] = "^0.2.0";
                    json.dependencies["@euglena/core"] = "0.1.6";
                    json.dependencies["@euglena/template"] = "1.0.1";
                    json.dependencies["@euglena/organelle.time.js"] = "^0.1.0";
                    text = beautify(json, null, 2, 10);
                    fs_1.writeFile(name + "/package.json", text, { "encoding": "utf-8" }, err_back);
                });
            });
            waitForPathToBeCreated([name + "/src/app/app.component.ts", name + "/src/app/app.module.ts"]).then(() => {
                //Copying file 
                console.log("Copying files into the new project.");
                child_process_1.exec('cp -r ' + __dirname + '/angular/** ' + name + "/src", (err, stdout, stderr) => {
                    if (err)
                        console.error(err);
                });
            });
            let particlesTsFile = name + "/src/euglena/particles.ts";
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