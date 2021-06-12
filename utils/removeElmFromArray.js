/**
 * @template T
 * @param {T} elm
 * @param {T[]} array
 */
export function removeElmFromArray(elm, array) {
    const index = array.indexOf(elm);
    if (index < 0) { throw new Error("Tried removing element not in array"); }
    array.splice(index, 1);
}
