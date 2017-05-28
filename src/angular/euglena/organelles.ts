
/**
 * the WebUIOrganelle will be automatically initialized by the angular itself.
 * just add other organelles you need.
 */
import { alive } from "@euglena/core";
import { Organelle as TimeOrganelle } from "@euglena/organelle.time.js";

export var organelles = [

    new TimeOrganelle()

] as alive.Organelle<any>[];