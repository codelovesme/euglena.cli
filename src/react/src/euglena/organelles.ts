
import { alive } from "@euglena/core";
import { Organelle as TimeOrganelle } from "@euglena/organelle.time.js";
import { Organelle as WebUIOrganelle} from "./organelle/webui.react";

export default [

    new TimeOrganelle(),
    new WebUIOrganelle()


] as Array<alive.Organelle<any>>;