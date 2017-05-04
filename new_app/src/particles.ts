
import { euglena } from "@euglena/core";
import { euglena_template } from "@euglena/template";

const euglenaName = "$myself";

const particles: euglena.being.Particle[] = [
    {
        meta: {
            name: euglena_template.being.alive.constants.particles.EuglenaName,
            of:euglenaName
        },
        data: euglenaName
    },
    {
        meta: {
            name: euglena_template.being.alive.constants.particles.OrganelleList,
            of:euglenaName
        },
        data: [euglena_template.being.alive.constants.organelles.TimeOrganelle]
    },
    {
        meta: {
            name: euglena_template.being.alive.constants.particles.TimeOrganelleSap,
            of:euglenaName
        },
        data: {
            euglenaName: euglenaName
        }
    },
]

export = particles;