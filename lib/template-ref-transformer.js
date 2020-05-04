// const parser = require("node-html-parser");
// const htmlparser2 = require("htmlparser2");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
var crypto = require('crypto');

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

  console.log(options)

  // let dom = new JSDOM(source);
  // let htmlRoot = dom.window.document.documentElement
  // console.log('htmlRoot.children.length', htmlRoot.children.length)
  // console.log('htmlRoot.children.children.length', htmlRoot.children[1].children.length)
  let templateRefsToAdd = []

  templateRefy(source, attribute, search, templateBodyFunc, templateRefsToAdd)
  templateRefsToAdd.forEach(templateRef => {
    console.log('templateRef', templateRef)
    source = source + '\n' + templateRef;
  })

  // console.log('output', newSource)
  return source;
}

// all libraries fail me, i write my own method to get the dom attribute 
function getAttributeValuesFromSource(source, attr) {
  let values = []
  const regex = new RegExp(`\\s${attr}+?="(.+?)"`,'g')
  do {
    m = regex.exec(source);
    if (m) {
        values.push(m[1]);
    }
  } while (m);
  return values;
}


function templateRefy(source, attribute, search, templateBodyFunc, templateRefsToAdd) {
  const values = getAttributeValuesFromSource(source, attribute);
  for(value of values) {
    const matched = value.match(search);
    if (matched) {
      console.log('==== MATCH FOUND !! ====')
      // step 1: replace the attribute and value with a template reference constant
      const captureGroup = matched[1] || matched[0];
      console.log('==== CAPTURE GROUP: ====')
      console.log('captureGroup', captureGroup)
      const hashRef = crypto.createHash('md5').update(captureGroup).digest('base64')

      source.replace(value, `"${hashRef}"`)

      // step 2: create a ng template reference and assign it the ref previously
      templateRefString = `
        <ng-template #${hashRef}>
          ${templateBodyFunc(captureGroup)}
        </ng-template>
      `
      templateRefsToAdd.push(templateRefString);

      
    }
  }
}



module.exports = transform;
