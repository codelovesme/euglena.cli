
"use strict";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";

import Particle = euglena.AnyParticle;
import Class = js.Class;
import organelle = euglena_template.alive.organelle;
import particles = euglena_template.alive.particle;
import constants = euglena_template.alive.constants;

let this_: Organelle = null;

/**
 * Data model of the data which your organelle needed
 */
export interface SapContent {
    
}

export class Organelle extends euglena.alive.Organelle<SapContent> {
    private sapContent: particles.DbOrganelleSapContent;
    constructor() {
        super(this_.name,);
        this_ = this;
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(constants.particles.DbOrganelleSap, (particle: particles.DbOrganelleSap, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(constants.particles.ReadParticle, (particle: particles.ReadParticle, callback) => {
            let response = new euglena_template.alive.particle.Acknowledge(this.sapContent.euglenaName);
            if (callback) {
                callback(response);
            } else {
                this_.send(response,this_.name);
            }
        });
    }
    private getAlive() {
        this_.send(new euglena.ParticleV2(new euglena.MetaV2("NewOrganelleGotAlived",this.sapContent.euglenaName)),this_.name);
    }
}

