import { WaveSMS } from "../client";
import { ValidationErr } from "../exceptions/validation.err";
import {
    WaveSMSDeliveryReport,
    WaveSMSRawDeliveryReport,
    WaveSMSRawResponse,
    WaveSMSRequest,
    WaveSMSResponse
} from "../utils";
import { isValidPhoneNumber } from "libphonenumber-js";
import moment, { Moment } from "moment";

export class Sms {
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

    send = async (schedule?: Date | Moment): Promise<WaveSMSResponse[]> => {
        if (!this.#message) throw new ValidationErr('Text message is required.')
        if (this.#phones.length <= 0) throw new ValidationErr('Phone number is required.')

        const smsList = this.#phones.map((phone, i) => {
            if (!isValidPhoneNumber(String(phone), 'KE')) {
                throw new ValidationErr(`${phone} is an invalid Kenyan phone number.`)
            }

            let sms: WaveSMSRequest = {
                apikey: this.#client.config.apiKey,
                partnerID: this.#client.config.partnerId,
                pass_type: "plain",
                clientsmsid: i,
                mobile: phone,
                message: this.#message,
                shortcode: this.#client.config.senderId,
            }

            if (schedule) {
                schedule = moment(schedule)

                if (schedule.isBefore()) {
                    throw new ValidationErr('Scheduled time must be after current time.')
                }

                sms.timeToSend = schedule.unix()
            }

            return sms
        })

        let { responses } = await this.#client.makeRequest({
            url: '/services/sendbulk', data: {
                count: smsList.length,
                smslist: smsList
            }
        });

        return responses.map((r: WaveSMSRawResponse) => r['response-code'] === 1004 ? {
            code: r['response-code'],
            description: r['response-description'],
            mobile: Object(r.mobile).mobile,
        } : {
            code: r['response-code'],
            description: r['response-description'],
            mobile: r['mobile'],
            message_id: r['messageid'],
            client_sms_id: r['clientsmsid'],
            network_id: r['networkid']
        }) as WaveSMSResponse[]
    }

    getDeliveryReport = async (messageId: string | number): Promise<WaveSMSDeliveryReport> => {
        if (!messageId) throw new ValidationErr('Message ID is required.')

        const res:WaveSMSRawDeliveryReport = await this.#client.makeRequest({
            url: '/services/getdlr', data: {
                apikey: this.#client.config.apiKey,
                partnerID: this.#client.config.partnerId,
                messageID: messageId
            }
        })

        return {
            code: res["response-code"],
            description: res['response-description'],
            message_id: res['message-id'],
            delivery_status: res["delivery-status"],
            delivery_description: res["delivery-description"],
            delivery_tat: res["delivery-tat"],
            delivery_network_id: res["delivery-networkid"],
            delivery_time: res["delivery-time"]
        }
    }
}