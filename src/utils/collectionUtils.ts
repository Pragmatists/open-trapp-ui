import {forEach, union} from "lodash";

export function toReversedMap<T extends any>(mappingObject: {[key: string] : T[]}): Map<T, string[]> {
    const reversedMapping: Map<T, string[]> = new Map();
    forEach(mappingObject, (value, key) => {
        value && value.forEach(v => {
            reversedMapping.set(v, union(reversedMapping.get(v), [key]))
        })
    });

    return reversedMapping;
}