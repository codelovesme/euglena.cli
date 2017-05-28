/**
 * Created by codelovesme on 9/15/2015.
 */

"use strict";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";

import { chromosome } from "./chromosome";
import { particles } from "./particles";
import * as uuid from "uuid";

import { Injectable } from "@angular/core";
import { Organelle as WebUIOrganelle } from "./organelle.webui.angular";
import { organelles } from "./organelles";

import constants = euglena_template.alive.constants;

@Injectable()
export class Euglena {

    private euglenaName;

    constructor(webuiorganelle: WebUIOrganelle) {

        this.euglenaName = localStorage.getItem(constants.particles.EuglenaName);
        if (!this.euglenaName) {
            this.euglenaName = uuid.v1();
            localStorage.setItem(constants.particles.EuglenaName, this.euglenaName);
        }
        sys.type.StaticTools.Array.getAllMatched(particles, { meta: { name: constants.particles.EuglenaName } });
        particles.push({ meta: { name: euglena_template.alive.constants.particles.EuglenaName, of: this.euglenaName }, data: this.euglenaName as any });
        new euglena.alive.Cytoplasm(this.euglenaName, particles, organelles.concat(webuiorganelle), chromosome);
        euglena.alive.Cytoplasm.receive(new euglena_template.alive.particle.EuglenaHasBeenBorn(this.euglenaName), euglena_template.alive.constants.organelles.Cytoplasm);
    }
}