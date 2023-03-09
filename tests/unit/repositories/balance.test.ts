import { afterEach, beforeAll, describe, expect, it, SpyInstance, vi } from "vitest";
import { Balance } from "../../../src/repositories/balance";
import { WaveSMS } from "../../../src";

let wavesms: WaveSMS, balance: Balance, makeRequest: SpyInstance;

describe('balance', () => {
    beforeAll(() => {
        wavesms = new WaveSMS({
            apiKey: "apiKey",
            partnerId: "partnerId",
            senderId: 'senderId'
        })
        balance = wavesms.balance
        makeRequest = vi.spyOn(wavesms, 'makeRequest')
    })

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('send', () => {
        it('should fetch account balance.', async () => {
            const request = makeRequest.mockResolvedValue({
                'response-code': 200,
                'credit': '70.00',
                'partner-id': '6855'
            })

            const res = await balance.fetch()

            expect(res).toStrictEqual(70)
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/services/getbalance', data: {
                    apikey: 'apiKey',
                    partnerID: 'partnerId'
                }
            })
        });
    })
})