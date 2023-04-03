import { WaveSMSConfig } from "./utils";
import { Sms } from "./repositories/sms";
import { log } from "./utils/logger";
import { Balance } from "./repositories/balance";
import axios, { AxiosError } from "axios";
import { ValidationErr } from "./exceptions/validation.err";
import { UnauthorizedErr } from "./exceptions/unauthorized.err";
import { NotFoundError } from "./exceptions/not-found.err";
import { BadRequestError } from "./exceptions/bad-request.err";

const UNEXPECTED_ERROR_MESSAGE = "An unexpected error occurred while processing your request.";

export class WaveSMS {
    config: WaveSMSConfig
    sms: Sms = new Sms(this)
    balance: Balance = new Balance(this)

    constructor(config: WaveSMSConfig) {
        this.config = config
        this.config.baseUrl = config.baseUrl || 'https://login.wavesms.com/api'
    }

    makeRequest = async ({ url, method = 'post', data = {} }: { url: string, method?: 'get' | 'post', data?: any }) => {
        log.info('...[WAVESMS] - REQ:', { url, method, data })

        const http = axios.create({
            baseURL: this.config.baseUrl,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json'
            }
        });

        const res = http[method](url, data).then(({ data }) => data).catch(e => {
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

            throw new BadRequestError(e.message || 'Something went wrong')
        })

        log.info('...[WAVESMS] - RES:', { url, method, data })

        return res
    }
}