
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";

import constants = euglena_template.alive.constants;
import organelles = euglena_template.alive.constants.organelles;
import Particle = euglena.ParticleV1;

const euglenaName = "bb";

export const particles: Particle[] = [
    {
        meta: {
            name: euglena_template.alive.constants.particles.EuglenaName,
        },
        data: euglenaName
    },
    new euglena_template.alive.particle.TimeOrganelleSap({euglenaName},euglenaName),
    new euglena_template.alive.particle.WebUIOrganelleSap({euglenaName,rootComponentUrl:""},euglenaName),
];