import {Edel} from "../Edel/Edel";
import {Component} from "angular2/core";


@Component({
    selector: 'Component1',
    template: `<p>Component1 loaded</p>`
})
export class Component1 extends Edel {

    constructor() {
        super();
        this.loadComponent("DynamicComponent").subscribe(
            (instance:Edel) => console.log(instance),
            (error) => console.log("Error!")
        );
    }
}