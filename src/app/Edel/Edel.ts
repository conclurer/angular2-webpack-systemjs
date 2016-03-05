

import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";

export abstract class Edel {

    /**
     * Loads a component
     *
     * @param componentName
     * @returns {any}
     */
    protected importComponent(componentName:string):Observable<Function> {
        var path = `/app/${componentName}/${componentName}`;

        return Observable.create((observer:Subscriber<Function>) => {
            console.log("Hallo");
            if (typeof System !== "undefined") {
                // Ignore import warning - it just works
                // Import using SystemJS
                System.import(path).then(
                    (module) => {
                        var importedClass = module[componentName];
                        // Return imported class
                        observer.next(importedClass);
                        observer.complete();
                    },
                    (error) => {
                        console.log(error);
                        observer.error(error);
                    }
                );
            }
            else {
                // Import using RequireJS
                console.log(path);
                require.ensure([], (require) => {
                    require("."+path);
                });
            }
        });
    }

    /**
     * Loads a component and creates a new instance of the loaded component
     *
     * @param componentName
     * @param args
     * @returns {any}
     */
    protected loadComponent(componentName:string, ...args:any[]):Observable<Edel> {
        return Observable.create((observer:Subscriber<Edel>) => {
            this.importComponent(componentName).subscribe(
                (importedClass:Function) => {
                    var instance = Object.create(importedClass.prototype);
                    importedClass.apply(instance, args);
                    observer.next(instance);
                },
                (error) => observer.error(error),
                () => observer.complete()
            );
        });
    }
}