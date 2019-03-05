
import {sys} from "cessnalib";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import constants = euglena_template.alive.constants;
import Particle = euglena.AnyParticle;
import registerServiceWorker from './registerServiceWorker';
import {render} from "../../../components/index";

class SetTime extends euglena.ParticleV2<sys.type.Time> {
    public static readonly NAME = "SET_TIME";
    constructor(of: string, time:sys.type.Time) {
        super(new euglena.MetaV2(SetTime.NAME, of),time);
    }
}

export const particles = {
    incoming: {
        SetTime
    }
}



export class Organelle extends euglena_template.alive.organelle.WebUIOrganelle {

    public sap: euglena_template.alive.particle.WebUIOrganelleSap;
    public organelleName = constants.organelles.WebUIOrganelle;

    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(constants.particles.WebUIOrganelleSap, (sap) => {
            this.sap = sap;
            registerServiceWorker();
            render(sys.type.StaticTools.Time.now());
        });
        addAction(particles.incoming.SetTime.NAME, (particle) => {
            render(particle.data);
        });
    }
}