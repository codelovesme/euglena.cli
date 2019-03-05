
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import * as uuid from "uuid";
import constants = euglena_template.alive.constants;

export const euglenaName = (()=>{
        const temp = localStorage.getItem(constants.particles.EuglenaName) || uuid.v1();
        localStorage.setItem(constants.particles.EuglenaName, temp);
        return temp;
    })();


export default [
    new euglena.ParticleV2(new euglena.MetaV2(constants.particles.EuglenaName,constants.particles.EuglenaName),euglenaName),
    new euglena_template.alive.particle.TimeOrganelleSap({euglenaName},euglenaName),
    new euglena_template.alive.particle.WebUIOrganelleSap({euglenaName},euglenaName)
] as Array<euglena.ParticleV2<any>>;