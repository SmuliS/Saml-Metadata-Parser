const inplaceRemovePrefixFromObject = function inplaceRemovePrefixFromObject(
    theObject,
) {
    let result = null;
    if (theObject instanceof Array) {
        for (let i = 0; i < theObject.length; i++) {
            result = inplaceRemovePrefixFromObject(theObject[i]);
            if (result) {
                break;
            }
        }
    } else {
        for (let prop in theObject) {
            if (prop.indexOf(':') > -1) {
                let newProp =
                    prop.split(':')[0] == 'xmlns'
                        ? prop
                        : prop.split(':')[1];
                theObject[newProp] = theObject[prop];
                if (prop.split(':')[0] != 'xmlns') {
                    delete theObject[prop];
                }
                if (
                    theObject[newProp] instanceof Object ||
                    theObject[newProp] instanceof Array
                ) {
                    result = inplaceRemovePrefixFromObject(
                        theObject[newProp],
                    );
                    if (result) {
                        break;
                    }
                }
            }
            if (
                theObject[prop] instanceof Object ||
                theObject[prop] instanceof Array
            ) {
                result = inplaceRemovePrefixFromObject(
                    theObject[prop],
                );
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
};

module.exports = {
    inplaceRemovePrefixFromObject: inplaceRemovePrefixFromObject,
};
