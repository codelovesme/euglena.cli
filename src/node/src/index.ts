/**
 * Created by codelovesme on 9/15/2015.
 */

"use strict";
import { euglena } from "@euglena/core";
import { euglena_template } from "@euglena/template";
import * as path from "path";
import * as fs from "fs";
var jsonminify = require("jsonminify");

import Particle = euglena.being.Particle;
import interaction = euglena.being.interaction;
import constants = euglena_template.being.alive.constants;

import * as particles from "./particles";
import * as chromosome from "./chromosome";

process.on('uncaughtException', (err: any) => {
    console.log(err);
});

let applicationDirectory = path.join(path.resolve(__dirname), "../");

//Load Organelles
let files = fs.readdirSync(path.join(applicationDirectory, "./node_modules"));
let euglenaName = particles[euglena.sys.type.StaticTools.Array.indexOf(particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;
let organelleList = particles[euglena.sys.type.StaticTools.Array.indexOf(particles, { meta: { name: constants.particles.OrganelleList }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;
let organelles: Array<euglena.being.alive.Organelle<any>> = [];
for (let file of files) {
    if (!file || !file.includes("euglena.organelle.")) continue;
    let organelle: euglena.being.alive.Organelle<any> = null;
    try {
        organelle = <euglena.being.alive.Organelle<{}>>new (require(path.join(applicationDirectory, "./node_modules/", file))).Organelle();
    } catch (e) {
        console.log(file + " " + e.message);
    }
    if (!organelle) continue;
    if (organelleList.indexOf(organelle.name) < 0) continue;
    organelles.push(organelle);
    console.log(`${organelle.name} attached to the body.`);
}

//Load Genes

new euglena.being.alive.Cytoplasm(euglenaName, particles, organelles, chromosome);

euglena.being.alive.Cytoplasm.receive(new euglena_template.being.alive.particle.EuglenaHasBeenBorn(euglenaName), "universe");