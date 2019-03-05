import * as euglena from "@euglena/core";
import * as euglena_template from "@euglena/template";
import Gene = euglena.alive.dna.GeneV2;

import Cytoplasm = euglena.alive.Cytoplasm;
import constants = euglena_template.alive.constants;
import {euglenaName} from './particles';
import { particles as webUIParticles } from "./organelle/webui.react";

function reference(name: string, of: string) {
    return {meta: {name, of}};
}

export default [
    new Gene(
        "Send Saps to Organelles",
        {meta: {name: euglena_template.alive.constants.particles.EuglenaHasBeenBorn}},
        () => {
            const euglenaName = Cytoplasm.getParticle({meta: {name: constants.particles.EuglenaName}}).data;
            const webUISap = Cytoplasm.getParticle(reference(euglena_template.alive.constants.particles.WebUIOrganelleSap, euglenaName));
            const timeSap = Cytoplasm.getParticle(reference(euglena_template.alive.constants.particles.TimeOrganelleSap, euglenaName));
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.WebUIOrganelle, webUISap);
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.TimeOrganelle, timeSap);
        },euglenaName
    ),
    new Gene(
        "Set Time on UI",
        {meta: {name: euglena_template.alive.constants.particles.Time}},
        (particle: euglena_template.alive.particle.Time) => {
            Cytoplasm.transmit(euglena_template.alive.constants.organelles.WebUIOrganelle,new webUIParticles.incoming.SetTime(euglenaName,particle.data))
        }, euglenaName
    )
] as Gene[];