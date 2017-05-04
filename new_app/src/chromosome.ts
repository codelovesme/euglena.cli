
"use strict";

import { euglena_template } from "@euglena/template";
import { euglena } from "@euglena/core";
import * as path from "path";
import * as fs from "fs";

import * as _particles from "./particles";

import constants = euglena_template.being.alive.constants;
import ParticleV2 = euglena.being.ParticleV2;
import Particle = euglena.being.Particle;
import organelles = euglena_template.being.alive.organelle;
import particles = euglena_template.being.alive.particle;
import Cytoplasm = euglena.being.alive.Cytoplasm;
import Gene = euglena.being.alive.dna.GeneV2;

let euglenaName = _particles[euglena.sys.type.StaticTools.Array.indexOf(_particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;

//
//Genes are particles of Nucleus
//You should write some gene to make your euglena move
//
const chromosome: Gene[] = [
    new Gene(
        "When Euglena has been born, print Hello World on the console.",
        { meta: { name: constants.particles.EuglenaHasBeenBorn } },
        (particle: particles.EuglenaHasBeenBorn) => {
            console.log("Hello World !");
            let euglenaName = Cytoplasm.getParticle({ meta: { name: "EuglenaName" }, data: {} }).data;
            //fetch Query
            let sap = Cytoplasm.getParticle({ meta: { name: euglena_template.being.alive.constants.particles.TimeOrganelleSap, of: euglenaName } });
            Cytoplasm.transmit(euglena_template.being.alive.constants.organelles.TimeOrganelle, sap);
        },
        euglenaName
    ),
    new Gene(
        "When received particle Time, print it on the console. ",
        { meta: { name: constants.particles.Time } },
        (particle: particles.Time) => {
            let str = particle.data.clock.minute + " : " + particle.data.clock.second;
            console.log(str);
        },
        euglenaName
    )
];

export = chromosome;