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

  let templateRefsToAdd = []

  templateRefy(source, attribute, search, templateBodyFunc, templateRefsToAdd)
  templateRefsToAdd.forEach(templateRef => {
    console.log('templateRef', templateRef)
    source = source + '\n' + templateRef;
  })

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

function generateHash() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


function templateRefy(source, attribute, search, templateBodyFunc, templateRefsToAdd) {
  const values = getAttributeValuesFromSource(source, attribute);
  for(value of values) {
    const matched = search.exec(value);
    if (matched) {
      console.log('==== MATCH FOUND !! ====')
      // step 1: replace the attribute and value with a template reference constant
      const captureGroup = matched[1] || matched[0];
      console.log('==== CAPTURE GROUP: ====')
      console.log('captureGroup', captureGroup)
      const hashRef = generateHash();

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
