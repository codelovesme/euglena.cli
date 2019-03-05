import * as euglena from "@euglena/core";
import * as euglena_template from "@euglena/template";
import organelles from "./euglena/organelles";
import particles, {euglenaName} from "./euglena/particles";
import chromosome from "./euglena/chromosome";


new euglena.alive.Cytoplasm(particles, organelles, chromosome);
euglena.alive.Cytoplasm.receive(new euglena_template.alive.particle.EuglenaHasBeenBorn(euglenaName), euglena_template.alive.constants.organelles.Cytoplasm);