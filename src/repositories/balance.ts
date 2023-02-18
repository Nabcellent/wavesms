import { WaveSMS } from "../client";

export class Balance {
    #client: WaveSMS

    constructor(client: WaveSMS) {
        this.#client = client;
    }

    public async fetch() {
        const res = await this.#client.makeRequest({
            url: '/services/getbalance', data: {
                apikey: this.#client.config.apiKey,
                partnerID: this.#client.config.partnerId
            }
        });

        return { credit: Number(res.credit) }
    }
}