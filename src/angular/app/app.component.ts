import { Component } from '@angular/core';
import { Euglena } from "../euglena/index";
import { Organelle } from "../euglena/organelle.webui.angular";
import * as euglena_template from "@euglena/template";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(_: Euglena, organelle: Organelle) {
    organelle.addAction(euglena_template.alive.constants.particles.Time, (particle: euglena_template.alive.particle.Time) => {
      this.title = "It is "+particle.data.clock.hour+" : "+particle.data.clock.minute + " : " + particle.data.clock.second;
    });
  }
}
