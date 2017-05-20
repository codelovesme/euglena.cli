
"use strict";

import { sys, js } from "cessnalib";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import * as path from "path";
import * as fs from "fs";

import * as _particles from "./particles";

import constants = euglena_template.alive.constants;
import ParticleV2 = euglena.ParticleV2;
import Particle = euglena.AnyParticle;
import organelles = euglena_template.alive.organelle;
import particles = euglena_template.alive.particle;
import Cytoplasm = euglena.alive.Cytoplasm;
import Gene = euglena.alive.dna.GeneV2;

let euglenaName = _particles[sys.type.StaticTools.Array.indexOf(_particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;

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
            let timeOrganelleInfo = Cytoplasm.getParticle({
                meta: { name: euglena_template.alive.constants.particles.OrganelleInfo, of: euglenaName },
                data: { name: euglena_template.alive.constants.organelles.TimeOrganelle }
            }) as euglena_template.alive.particle.OrganelleInfo<euglena_template.alive.particle.TimeOrganelleSap>;
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.TimeOrganelle, timeOrganelleInfo.data.sap);
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