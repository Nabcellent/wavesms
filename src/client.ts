import { WaveSMSConfig } from "./utils/types";
import { SMS } from "./repositories/SMS";
import { log } from "./utils/logger";
import { Balance } from "./repositories/balance";
import axios from "axios";

const UNEXPECTED_ERROR_MESSAGE = "An unexpected error occurred while processing your request.";

export class WaveSMS {
    config: WaveSMSConfig
    sms: SMS = new SMS(this)
    balance: Balance = new Balance(this)

    constructor(config: WaveSMSConfig) {
        this.config = config
        this.config.baseUrl = config.baseUrl || 'https://login.wavesms.com/api'
    }

    makeRequest = async ({ url, method = 'post', data = {} }: { url: string, method?: 'get' | 'post', data?: any }) => {
        url = `${this.config.baseUrl}${url}`

        log.info('...[WAVESMS]: Make Request', { url, method, data })

        return axios[method](url, data).then(({ data }) => data).catch(e => {
            log.error('...[WAVESMS]: Make Request Error', e);

            return {
                type: "TransportError",
                message: UNEXPECTED_ERROR_MESSAGE,
                rootCause: e
            }
        })
    }
}