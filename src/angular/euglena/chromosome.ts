
"use strict";


import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";

import constants = euglena_template.alive.constants;
import Particle = euglena.AnyParticle;
import particles = euglena_template.alive.particle;
import Cytoplasm = euglena.alive.Cytoplasm;
import Gene = euglena.alive.dna.GeneV1;

import { particles as _particles } from "./particles";

let euglenaName = _particles[sys.type.StaticTools.Array.indexOf(_particles, { meta: { name: constants.particles.EuglenaName }, data: null }, (ai: Particle, t: Particle) => ai.meta.name == t.meta.name)].data;

/**
 * Genes are particles of Nucleus
 */
export var chromosome = [
    new Gene(
        "Send Saps to Organelles",
        { meta: { name: euglena_template.alive.constants.particles.EuglenaHasBeenBorn } },
        (particle: euglena_template.alive.particle.EuglenaHasBeenBorn) => {
            let euglenaName = Cytoplasm.getParticle({ meta: { name: constants.particles.EuglenaName } }).data;
            let timeOrganelleSap = Cytoplasm.getParticle({
                meta: { name: euglena_template.alive.constants.particles.TimeOrganelleSap, of: euglenaName }
            }) as particles.TimeOrganelleSap;
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.TimeOrganelle, timeOrganelleSap);

            let webuiOrganelleSap = Cytoplasm.getParticle({
                meta: { name: euglena_template.alive.constants.particles.WebUIOrganelleSap, of: euglenaName }
            }) as particles.WebUIOrganelleSap;
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.WebUIOrganelle, webuiOrganelleSap);
        }
    ),
    new Gene(
        "When received particle Time, send it to the webuiOrganelle ",
        { meta: { name: constants.particles.Time } },
        (particle: particles.Time) => {
            /**
             * When received Particle Time, we can reach it from here and use how we desire
             * In this sample code below, we are sending it to the WebuiOrganelle
             */
            Cytoplasm.transmit(constants.organelles.WebUIOrganelle,particle);
        },
        euglenaName
    ),
    new Gene(
        "WebUI Organelle has come to life",
        { meta: { name: euglena_template.alive.constants.particles.OrganelleHasComeToLife } },
        (particle: euglena_template.alive.particle.OrganelleHasComeToLife) => {
            let euglenaName = Cytoplasm.getParticle({ meta: { name: constants.particles.EuglenaName } }).data;
            switch (particle.data.organelleName) {
                case constants.organelles.WebUIOrganelle:
                    //learn domain
                    //Cytoplasm.transmit(constants.organelles.WebUIOrganelle, new particles.ReadParticle({ meta: { name: constants.particles.Domain }, data: {} }, euglenaName));
                    break;
                case constants.organelles.NetClientOrganelle:
                    //Cytoplasm.transmit(constants.organelles.NetClientOrganelle, new particles.WhoAmI());
                    break;
                default:
                    break;
            }
        }
    )
];  