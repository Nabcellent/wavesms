import { WaveSMSConfig } from "./utils/types";
import { SMS } from "./repositories/SMS";
import { log } from "./utils/logger";
import { Balance } from "./repositories/balance";
import axios, { AxiosError } from "axios";
import { ValidationErr } from "./exceptions/validation.err";
import { UnauthorizedErr } from "./exceptions/unauthorized.err";
import { NotFoundError } from "./exceptions/not-found.err";

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
        log.info('...[WAVESMS] - Make Request:', { url, method, data })

        const http = axios.create({
            baseURL: this.config.baseUrl,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json'
            }
        });

        return http[method](url, data).then(({ data }) => data).catch(e => {
            if(e instanceof AxiosError) {
                if (e.response?.status === 422) {
                    throw new ValidationErr(e.response.data.errors)
                }
                if (e.response?.status === 401) {
                    throw new UnauthorizedErr(e.response?.data['response-description'])
                }
                if (e.response?.status === 404) {
                    throw new NotFoundError()
                }
            }

            return {
                type: "TransportError",
                message: UNEXPECTED_ERROR_MESSAGE,
                rootCause: e
            }
        })
    }
}