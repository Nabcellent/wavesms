import { afterEach, beforeAll, describe, expect, it, SpyInstance, vi } from "vitest";
import moment from "moment";
import { Sms } from "../../../src/repositories/sms";
import { WaveSMS } from "../../../src";
import { ValidationErr } from "../../../src/exceptions/validation.err";

let wavesms: WaveSMS, sms: Sms, makeRequest: SpyInstance;
const validPhone = 254110039317, invalidPhone = '82547123456789'

describe('sms', () => {
    beforeAll(() => {
        wavesms = new WaveSMS({
            apiKey: "apiKey",
            partnerId: 'partnerId',
            senderId: 'senderId'
        })
        sms = wavesms.sms
        makeRequest = vi.spyOn(wavesms, 'makeRequest')
    })

    afterEach(() => {
        vi.restoreAllMocks();

        wavesms = new WaveSMS({
            apiKey: "apiKey",
            partnerId: 'partnerId',
            senderId: 'senderId'
        })
        sms = wavesms.sms
        makeRequest = vi.spyOn(wavesms, 'makeRequest')
    });

    describe('send', () => {
        it('should reject invalid phone numbers', () => {
            let phoneNumbers = ['+254713', '+2547XXXXXXXX', '0712345678', '+25571234567890', ''];

            expect(() => sms.text('#waveSMSTest').send()).rejects.toThrow('Phone number is required.')
            expect(() => sms.text('#waveSMSTest').to(invalidPhone).send()).rejects.toThrow(`${invalidPhone} is an invalid Kenyan phone number.`)
            expect(() => sms.text('#waveSMSTest').to(phoneNumbers).send()).rejects.toThrow(`+254713 is an invalid Kenyan phone number.`)
        });

        it('should reject empty messages', () => {
            expect(() => sms.to(validPhone).send()).rejects.toThrow(ValidationErr)
            expect(() => sms.text('').to(validPhone).send()).rejects.toThrow('Text message is required.')
        });

        it('should reject messages scheduled for the past.', async () => {
            expect(() => sms.text('#waveSMSTest').to(validPhone).send(moment().subtract(1, 's')))
                .rejects.toThrow('Scheduled time must be after current time.')
        });

        it('should send SMS if data is valid.', async () => {
            const request = makeRequest.mockResolvedValue({
                responses: [{
                    "response-code": 200,
                    "response-description": "Success",
                    "mobile": "254733123456",
                    "messageid": 75085465,
                    "clientsmsid": "1234",
                    "networkid": "2"
                }],
            })

            const res = await sms.text('#waveSMSTest').to(validPhone).send()

            expect(res).toStrictEqual([{
                code: 200,
                description: 'Success',
                message_id: 75085465,
                client_sms_id: "1234",
                network_id: "2",
                mobile: "254733123456"
            }])
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/services/sendbulk', data: {
                    count: 1,
                    smslist: [{
                        apikey: 'apiKey',
                        partnerID: 'partnerId',
                        pass_type: "plain",
                        clientsmsid: 0,
                        mobile: validPhone,
                        message: '#waveSMSTest',
                        shortcode: 'senderId',
                    }]
                }
            })
        });

        it('should send a scheduled SMS if data is valid.', async () => {
            const request = makeRequest.mockResolvedValue({
                responses: [{
                    "response-code": 200,
                    "response-description": "Success",
                    "mobile": "254733123456",
                    "messageid": 75085465,
                    "clientsmsid": "1234",
                    "networkid": "2"
                }],
            })

            const schedule = moment().add(1, "d")

            const res = await sms.text('#waveSMSTest').to(validPhone).send(schedule)

            expect(res).toStrictEqual([{
                code: 200,
                description: 'Success',
                message_id: 75085465,
                client_sms_id: "1234",
                network_id: "2",
                mobile: "254733123456"
            }])
            expect(request).toHaveReturnedWith({
                responses: [{
                    'response-code': 200,
                    'response-description': 'Success',
                    messageid: 75085465,
                    clientsmsid: "1234",
                    networkid: "2",
                    mobile: "254733123456"
                }]
            })
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/services/sendbulk', data: {
                    count: 1,
                    smslist: [{
                        apikey: 'apiKey',
                        partnerID: 'partnerId',
                        pass_type: "plain",
                        clientsmsid: 0,
                        mobile: validPhone,
                        message: '#waveSMSTest',
                        shortcode: 'senderId',
                        timeToSend: schedule.unix()
                    }]
                }
            })
        });
    })

    describe('getDeliveryReport', () => {
        it('should reject empty message ID', async () => {
            expect(() => sms.getDeliveryReport('')).rejects.toThrow(ValidationErr)
        });

        it('should send SMS if data is valid.', async () => {
            const messageId = 75085465
            const request = makeRequest.mockResolvedValue({
                "response-code": 200,
                "response-description": "Success",
                "message-id": messageId,
                "delivery-status": 32,
                "delivery-description": 'DeliveredToTerminal',
                "delivery-tat": "00:00:06",
                "delivery-networkid": 1,
                "delivery-time": "2023-02-18 21:16:22"
            })

            const res = await sms.getDeliveryReport(messageId)

            expect(res).toStrictEqual({
                code: 200,
                description: 'Success',
                message_id: messageId,
                delivery_status: 32,
                delivery_description: 'DeliveredToTerminal',
                delivery_tat: "00:00:06",
                delivery_network_id: 1,
                delivery_time: "2023-02-18 21:16:22"
            })
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/services/getdlr', data: {
                    apikey: 'apiKey',
                    partnerID: 'partnerId',
                    messageID: messageId
                }
            })
        });
    })
})