const { getOptions } = require("loader-utils");
const validateOptions = require("schema-utils");

const loaderName = "ng-template-inject-loader";

const optionsSchema = {
  type: "object",
  properties: {
    search: {
      anyOf: [
        {
          instanceof: 'RegExp'
        },
        {
          type: 'string'
        }
      ]
    },
    attribute: {
      anyOf: [
        {
          instanceof: "RegExp",
        },
        {
          type: "string",
        },
      ],
    },
    templateBodyFunc: {
      anyOf: [
        {
          instanceof: "Function",
        },
      ],
    },
  },
  additionalProperties: false,
};

const defaultOptions = {
  attribute: null,
};

function getOptionsArray(config) {
  const rawOptions = getOptions(config);
  const rawOptionsArray =
    typeof rawOptions.multiple !== "undefined"
      ? rawOptions.multiple
      : [rawOptions];
  const optionsArray = [];

  for (const optionsIndex in rawOptionsArray) {
    validateOptions(optionsSchema, rawOptionsArray[optionsIndex], loaderName);

    optionsArray[optionsIndex] = Object.assign(
      {},
      defaultOptions,
      rawOptionsArray[optionsIndex]
    );
  }

  return optionsArray;
}

module.exports = getOptionsArray;
