import { WaveSMS } from "../client";
import { ValidationErr } from "../exceptions/validation.err";
import { WaveSMSResponse } from "../utils";

export class SMS {
    #client: WaveSMS
    #message: string = "";
    #phones: (string | number)[] = [];

    constructor(client: WaveSMS) {
        this.#client = client;
    }

    public text(message: string) {
        this.#message = message;
        return this;
    }

    public to(to: string | number | (string | number)[]) {
        this.#phones = Array.isArray(to) ? to : [to]

        return this;
    }

    public async send(): Promise<WaveSMSResponse[]> {
        if (!this.#message) throw new ValidationErr('Please provide a message.')
        if (this.#phones.length <= 0) throw new ValidationErr('Please provide at least one phone number.')

        const smsList = this.#phones.map((phone, i) => {
            return {
                apikey: this.#client.config.apiKey,
                partnerID: this.#client.config.partnerId,
                pass_type: "plain",
                clientsmsid: i,
                mobile: phone,
                message: this.#message,
                shortcode: this.#client.config.senderId,
            }
        })

        let { responses } = await this.#client.makeRequest({
            url: '/services/sendbulk', data: {
                count: smsList.length,
                smslist: smsList
            }
        });

        return responses.map((r: WaveSMSResponse) => r['response-code'] === 1004 ? {
            'response-code': r['response-code'],
            'response-description': r['response-description'],
            mobile: Object(r.mobile).mobile,
        } : r)
    }
}