const { parse, HtmlElement } = require("node-html-parser");
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');


function transform(source, options) {
  const { templateBodyFunc, search } = options;
  let attribute;
  if (options.attribute instanceof RegExp) {
    // if the `attribute` type is RegExp, we ignore `flags`
    attribute = options.attribute;
  } else if (flags !== null) {
    attribute = new RegExp(options.attribute, flags);
  } else {
    attribute = options.attribute;
  }

  let htmlRoot = parse(source);
  let templateRefsToAdd = []
  templateRefy(htmlRoot, attribute, search, templateBodyFunc, templateRefsToAdd)

  templateRefsToAdd.forEach(templateRef) {
    newSourece = newSource + '\n' + templateRef;
  }

  return newSource;
}


function templateRefy(htmlRoot, attribute, search, templateBodyFunc, templateRefsToAdd) {
  htmlRoot.childNodes.forEach(element => {
    if (element instanceof HtmlElement && element.hasAttribute(attribute)) {

      // step 1: replace the attribute value with a template reference constant
      const matched = element.getAttribute(attribute).match(search);
      if (!matched) {
        continue;
      }
      const captureGroup = matched[1] || matched[0];
      const hashRef = md5sum.update(captureGroup).digest('base64')
      element.setAttribute(`[${attribute}]`, hashRef);

      // step 2: create a ng template reference and assign it the ref previously
      templateRefString = `
        <ng-template #${hashRef}>
          <t>#${templateBodyFunc(captureGroup)}</t>
        </ng-template>
      `
      templateRefsToAdd.push(templateRefString);
    }

    if (element.childNodes > 0) {
      templateRefy(element, attribute, search, templateBodyFunc, templateRefsToAdd)
    }
  });
}



module.exports = transform;
