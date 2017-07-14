
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";


import { Injectable } from "@angular/core";

import Particle = euglena.ParticleV1;
import Exception = sys.type.Exception;
import constants = euglena_template.alive.constants;


@Injectable()
export class Organelle extends euglena_template.alive.organelle.WebUIOrganelle {

    private map: sys.type.Map<string, ((particle, callback) => void)[]> = new sys.type.Map<string, ((particle, callback) => void)[]>();
    public sap: euglena_template.alive.particle.WebUIOrganelleSap;
    private _addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void;
    constructor() {
        super();
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        this._addAction = addAction;
        this.addAction(constants.particles.WebUIOrganelleSap, (sap) => {
            this.sap = sap;
        });
    }

    public addAction(key: string, listener: (particle, callback) => void) {
        let listeners = this.map.get(key);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.map.set(key, [listener]);
            this._addAction(key, (particle, callback) => {
                let ll = this.map.get(key);
                for (let l of ll) {
                    l(particle, callback);
                }
            });
        }
    }
}