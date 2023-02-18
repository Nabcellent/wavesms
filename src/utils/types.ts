export type WaveSMSConfig = {
    apiKey: string
    partnerId: number | string
    senderId: string
    baseUrl?: string
}

export type WaveSMSResponse = {
    'response-code': number,
    'response-description': string,
    mobile: string
    clientsmsid: string
    messageid?: number
    networkid?: string
    partnerID?: string
    shortcode?: null
}