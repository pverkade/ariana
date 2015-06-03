/**
 * Created by zeta on 6/3/15.
 */
/// <reference path="base-program"/>

enum FilterType {Brightness};

class Filter {
    attributes : Object;
    filterType : FilterType;

    constructor () {
        this.attributes = {};
    }

    setAttribute (name : string, value : any) {
        this.attributes[name] = value
    }

    getAttributeNames () : Array<string> {
        return Object.keys(this.attributes);
    }

    render() {}
}