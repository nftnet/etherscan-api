const axios = require("axios");
const EtherscanApiStatusError = require("./etherscanApiStatusError");

/**
 * @param {string} chain
 * @returns {string}
 */
function pickChainUrl(chain) {
  if (!chain || !TESTNET_API_URL_MAP[chain]) {
    return MAIN_API_URL;
  }

  return TESTNET_API_URL_MAP[chain];
}

const MAIN_API_URL = "https://api.etherscan.io";
const TESTNET_API_URL_MAP = {
  ropsten: "https://api-ropsten.etherscan.io",
  kovan: "https://api-kovan.etherscan.io",
  rinkeby: "https://api-rinkeby.etherscan.io",
  homestead: "https://api.etherscan.io",
};

// Axios automatically throws an error if statusCode is 4xx/5xx
module.exports = function (chain, timeout) {
  var client = axios.create({
    baseURL: pickChainUrl(chain),
    timeout: timeout,
  });

  /**
   * @param query
   * @returns {Promise<any>}
   */
  function getRequest(query) {
    return new Promise(function (resolve, reject) {
      client
        .get("/api?" + query)
        .then(function (response) {
          var data = response.data;
          if (data.status && data.status != 1) {
            let returnMessage = data.message || "NOTOK";
            if (
              data.hasOwnProperty("result") &&
              typeof data.result === "string"
            ) {
              returnMessage = data.result;
            } else if (data.message && typeof data.message === "string") {
              returnMessage = data.message;
            }

            return reject(new EtherscanApiStatusError(returnMessage));
          }

          if (data.error) {
            var message = data.error;

            if (typeof data.error === "object" && data.error.message) {
              message = data.error.message;
            }

            return reject(new Error(message));
          }

          resolve(data);
        })
        .catch(function (error) {
          return reject(new Error(error));
        });
    });
  }

  return getRequest;
};
