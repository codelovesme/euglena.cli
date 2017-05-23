
import * as euglena from "@euglena/core";
import * as euglena_template from "@euglena/template";

const euglenaName = "app_test2";

const particles: euglena.AnyParticle[] = [
    {
        meta: {
            name: euglena_template.alive.constants.particles.EuglenaName,
            of: euglenaName
        },
        data: euglenaName
    },
    new euglena_template.alive.particle.OrganelleInfo(
        euglena_template.alive.constants.organelles.TimeOrganelle,
        euglena_template.alive.particle.OrganelleInfoLocationType.NodeModules,
        "@euglena/organelle.time.js",
        new euglena_template.alive.particle.TimeOrganelleSap({euglenaName},euglenaName),
        euglenaName
    )
]

export = particles;