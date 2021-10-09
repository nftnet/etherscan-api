const querystring = require("querystring");
module.exports = function (getRequest, apiKey) {
  return {
    /**
     * Returns project information and social media links of an ERC-20/ERC-721 token.
     * @param {string} contractaddress - Contract address
     * @example
     *     var supply = api.token.tokeninfo(
     *       '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a' // DGD contract address
     * );
     * @returns {Promise.<object>}
     */
    tokeninfo(contractaddress) {
      const module = "token";
      const action = "tokeninfo";

      var queryObject = {
        module,
        action,
        apiKey,
      };

      if (contractaddress) {
        queryObject.contractaddress = contractaddress;
      }

      var query = querystring.stringify(queryObject);
      return getRequest(query);
    },
  };
};
