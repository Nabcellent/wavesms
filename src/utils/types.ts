export type WaveSMSConfig = {
    apiKey: string
    partnerId: number | string
    senderId: string
    baseUrl?: string
}

export type WaveSMSRequest = {
    apikey: string,
    partnerID: number | string,
    pass_type: "plain",
    clientsmsid: number,
    mobile: number | string,
    message: string,
    shortcode: string | "Test",
    timeToSend?: number
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

export type WaveSMSDeliveryReport = {
    "response-code": number,
    "message-id": string,
    "response-description": string,
    "delivery-status": number,
    "delivery-description": string,
    "delivery-tat": string,
    "delivery-networkid": number,
    "delivery-time": Date
}