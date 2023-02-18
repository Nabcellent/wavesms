export type WaveSMSConfig = {
    apiKey: string
    partnerId: number | string
    senderId: string
    baseUrl?: string
}

export type WaveSMSResponse = {
    'response-code': number,
    'response-description': string,
    mobile: number
    clientsmsid: number
    messageid?: number | string
    apikey?: string
    pass_type?: string
    message?: string
    networkid?: string
    partnerID?: string
    shortcode?: string | null
}