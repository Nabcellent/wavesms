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

export type WaveSMSRawResponse = {
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

export type WaveSMSResponse = {
    code: number,
    description: string,
    mobile: number
    client_sms_id: number
    message_id?: number | string
    api_key?: string
    pass_type?: string
    message?: string
    network_id?: string
    partner_id?: string
    shortcode?: string | null
}

export type WaveSMSRawDeliveryReport = {
    "response-code": number,
    "message-id": string,
    "response-description": string,
    "delivery-status": number,
    "delivery-description": string,
    "delivery-tat": string,
    "delivery-networkid": number,
    "delivery-time": Date
}

export type WaveSMSDeliveryReport = {
    code: number,
    message_id: string,
    description: string,
    delivery_status: number,
    delivery_description: string,
    delivery_tat: string,
    delivery_network_id: number,
    delivery_time: Date
}