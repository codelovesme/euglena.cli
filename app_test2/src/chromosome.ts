
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

/**
 * Getting EuglenaName of this Application from Cytoplasm
 */
let euglenaName = _particles[sys.type.StaticTools.Array.indexOf(_particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;

/**
 * Genes are particles of Nucleus
 * You should write some gene to make your euglena move
 */
const chromosome: Gene[] = [
    new Gene(
        "When Euglena has been born, send each organelle inital data to the corresponding organelle.",
        { meta: { name: constants.particles.EuglenaHasBeenBorn } },
        (particle: particles.EuglenaHasBeenBorn) => {
            /**
             * Fetching the TimeOrganelle information / initial data from Cytoplasm
             */
            let timeOrganelleInfo = Cytoplasm.getParticle({
                meta: { name: euglena_template.alive.constants.particles.OrganelleInfo, of: euglenaName },
                data: { name: euglena_template.alive.constants.organelles.TimeOrganelle }
            }) as euglena_template.alive.particle.OrganelleInfo<euglena_template.alive.particle.TimeOrganelleSap>;

            /**
             * Transmitting the organelle initial data set into the organelle itself to 
             * let the organelle initialize itself and getting alive
             */
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.TimeOrganelle, timeOrganelleInfo.data.sap);
        },
        euglenaName
    ),
    new Gene(
        "When received particle Time, print it on the console. ",
        { meta: { name: constants.particles.Time } },
        (particle: particles.Time) => {
            /**
             * When received Particle Time, we can reach it from here and use how we desire
             * In this sample code below, we are printing the minute and second values on the console.
             */
            console.log(particle.data.clock.minute + " : " + particle.data.clock.second);
        },
        euglenaName
    )
];

export = chromosome;