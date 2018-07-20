const request = require("request-promise");
const DEFAULT_PORT = 3099;
const DEFAULT_SERVICE_URI = "http://localhost:" + DEFAULT_PORT + "/credentials";

/**
 * Class representing Credential Manager
 */
class CredentialManager {

    /**
     * Add configuration of credential server
     * @param {{uri}} opts
     */
    config(opts) {
        this.opts = opts;
    }

    /**
     * Create pool of userIds based on creds object
     * @param {Object} creds - set of user credentials
     * @throws {Error}
     * @example CredentialManager.createPool(credentials);
     */
    static createPool(creds) {
        return request({
            method: "POST",
            uri: this.opts.uri || DEFAULT_SERVICE_URI,
            body: creds,
            json: true
        })
        .catch(e => {
            throw new Error("Credential pool has not been created")
        })
    }

    /**
     * Return free credentials from pool
     * @return {Promise<Object>} - promise that resolves with set of credentials
     * @throws {Error}
     * @example 
     * CredentialManager.getCredentials();
     * const currentCredentials = await CredentialManager.credentials;
     */
    static getCredentials() {
        this.credentials = request({
            method: "GET",
            uri: this.opts.uri || DEFAULT_SERVICE_URI,
        })
        .then(body => JSON.parse(body))
        .catch(e => {
            throw e
        })
    }

    /**
     * Free credentials
     * @throws {Error}
     * @example CredentialManager.freeCredentials();
     */
    static freeCredentials() {
        return this.credentials.then(credentials => {
            if (credentials) {
                return request({
                    method: "PUT",
                    uri: this.opts.uri || DEFAULT_SERVICE_URI,
                    body: {
                        username: credentials.username
                    },
                    json: true
                })
            }
        }).catch(e => {
            throw e
        })
    }


}

module.exports = CredentialManager;