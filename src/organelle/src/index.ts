
"use strict";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";

import Particle = euglena.AnyParticle;

export class Organelle extends euglena.alive.Organelle<particles.incoming.SapContent> {
    public static readonly NAME = "CHANGE HERE WITH A UNIQUE NAME"
    private sapContent: particles.incoming.SapContent;
    constructor() {
        super(Organelle.NAME);
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(particles.incoming.Sap.NAME, (particle: particles.incoming.Sap, callback) => {
            this.sapContent = particle.data;
            this.getAlive();
        });
        /**
         * TODO:
         * Add Actions below in this method "bindActions" 
         * 
         */
    }
    private getAlive() {

        /**
         * TODO:
         * Write something to make state of the organelle that
         * organelle can take requests, and work.
         */

        /**
         * send a notification to the Cytoplasm
         * to inform about the organelle has been ready to get requests
         * */
        this.send(new euglena_template.alive.particle.OrganelleHasComeToLife(this.name,this.sapContent.euglenaName));
    }
}

export namespace particles {
    export namespace incoming {
        export interface SapContent {
            euglenaName:string
        }
        export class Sap extends euglena.ParticleV2<SapContent>{
            public static readonly NAME = Organelle.NAME+".sap";
            
            /**
             *  TODO:
             * Add fields needed from outside
             * before started the organelle working
             */

            constructor(of:string,data:SapContent){
                super(new euglena.MetaV2(Sap.NAME,of),data);
            }
        }
    }
    export namespace outgoing{

    }
    export namespace shared {
        
    }
}
