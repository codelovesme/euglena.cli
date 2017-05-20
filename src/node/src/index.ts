/**
 * Created by codelovesme on 9/15/2015.
 */

"use strict";
import * as euglena from "@euglena/core";
import * as euglena_template from "@euglena/template";
import * as path from "path";
import * as fs from "fs";
import { sys, js } from "cessnalib";
var jsonminify = require("jsonminify");

import Particle = euglena.AnyParticle;
import interaction = euglena.interaction;
import constants = euglena_template.alive.constants;
import OrganelleInfo = euglena_template.alive.particle.OrganelleInfo;

import * as particles from "./particles";
import * as chromosome from "./chromosome";

process.on('uncaughtException', (err: any) => {
    console.log(err);
});

let applicationDirectory = path.join(path.resolve(__dirname), "../");

//Load Organelles
let euglenaName = particles[sys.type.StaticTools.Array.indexOf(particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;
let organelles: Array<euglena.alive.Organelle<any>> = [];
let organelleInfos = sys.type.StaticTools.Array.getAllMatched(particles, { meta: { name: constants.particles.OrganelleInfo }, data: null }, (ai: Particle, t: Particle) => ai.meta.name === t.meta.name) as OrganelleInfo<any>[];
for (let o of organelleInfos) {
    switch (o.data.location.type) {
        case euglena_template.alive.particle.OrganelleInfoLocationType.NodeModules:
            let organelle: euglena.alive.Organelle<any> = null;
            try {
                organelle = <euglena.alive.Organelle<{}>>new (require(path.join(applicationDirectory, "./node_modules/", o.data.location.path))).Organelle();
            } catch (e) {
                console.log(o.data.name + " " + e.message);
            }
            if (!organelle) continue;
            organelles.push(organelle);
            console.log(`${organelle.name} attached to the body.`);
            break;
    }
}

//Load Genes

new euglena.alive.Cytoplasm(euglenaName, particles, organelles, chromosome);

euglena.alive.Cytoplasm.receive(new euglena_template.alive.particle.EuglenaHasBeenBorn(euglenaName), "universe");