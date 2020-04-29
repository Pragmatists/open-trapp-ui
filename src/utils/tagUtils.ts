import * as tagsConfig from "../tagsConfig.json";
import {toReversedMap} from "./collectionUtils";

export function extractAutoAddedTagsMapping(): Map<string, string[]> {
    return toReversedMap(tagsConfig.autoSubTags);
}