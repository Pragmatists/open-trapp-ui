import {toReversedMap} from "./collectionUtils";

describe('mapping reversal', () => {
    it('should reverse mapping', () => {
        const mappingObject = {
            key1: ['val1', 'val2'],
            key2: ['val2', 'val3']
        };

        const result = toReversedMap(mappingObject);

        expect(result.get('val1')).toEqual(['key1']);
        expect(result.get('val2')).toEqual(['key1','key2']);
        expect(result.get('val3')).toEqual(['key2']);
    });

    it('should deal with empty values', () => {
        const mappingObject = {
            key: []
        };

        const result = toReversedMap(mappingObject);

        expect(result.size).toEqual(0);
    });

    it('should deal with empty mapping object', () => {
        const mappingObject = {};

        const result = toReversedMap(mappingObject);

        expect(result.size).toEqual(0);
    });


    it('should deal with non-truthy values', () => {
        const mappingObject = {
            key1: null,
            key2: undefined
        };

        const result = toReversedMap(mappingObject);

        expect(result.size).toEqual(0);
    });
});