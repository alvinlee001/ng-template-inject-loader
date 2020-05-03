// const parser = require("node-html-parser");
// const htmlparser2 = require("htmlparser2");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');


function transform(source, options) {
  const { templateBodyFunc, attribute, flags } = options;
  let search;
  if (options.search instanceof RegExp) {
    // if the `attribute` type is RegExp, we ignore `flags`
    search = options.search;
  } else if (flags !== null) {
    search = new RegExp(options.search, flags);
  } else {
    search = options.search;
  }

  let dom = new JSDOM(source);
  let htmlRoot = dom.window.document.documentElement
  console.log('htmlRoot.children.length', htmlRoot.children.length)
  console.log('htmlRoot.children.children.length', htmlRoot.children[1].children.length)
  let templateRefsToAdd = []
  templateRefy(htmlRoot, attribute, search, templateBodyFunc, templateRefsToAdd)
  const newSource = htmlRoot.innerHTML
  templateRefsToAdd.forEach(templateRef => {
    console.log('templateRef', templateRef)
    newSource = newSource + '\n' + templateRef;
  })

  // console.log('output', newSource)
  return newSource;
}


function templateRefy(htmlRoot, attribute, search, templateBodyFunc, templateRefsToAdd) {
  htmlRoot.children.forEach((element, i)  => {
    console.log('.', element)
    if (element && element.hasAttribute instanceof Function && element.hasAttribute(attribute)) {
      console.log('attribute found, value :', htmlRoot.children[i].documentElement.getAttribute(attribute))
      console.log('search', search)
      // if somehow the value of the attribute is invalid, we skip
      const matched = htmlRoot.children[i].documentElement.getAttribute(attribute).match(search);
      if (!matched) {
        console.log('no match found')
        return;
      }
      
      console.log('==== MATCH FOUND !! ====')
      // step 1: replace the attribute value with a template reference constant
      const captureGroup = matched[1] || matched[0];
      console.log('==== CAPTURE GROUP: ====')
      console.log('captureGroup', captureGroup)
      const hashRef = md5sum.update(captureGroup).digest('base64')
      htmlRoot.children[i].removeAttribute(attribute);
      htmlRoot.children[i].setAttribute(`[${attribute}]`, hashRef);

      // step 2: create a ng template reference and assign it the ref previously
      templateRefString = `
        <ng-template #${hashRef}>
          ${templateBodyFunc(captureGroup)}
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
