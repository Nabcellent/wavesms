# WaveSMS Api

This is a <i>Typescript</i> package that interfaces with [WaveSMS](https://wavesms.com/) SMS Api.
The API enables you to initiate mobile SMS notifications.

## Documentation

### Installation

You can install the package via npm or yarn:
```bash
yarn add @nabcellent/wavesms
```
### Getting Started
Initialize the WaveSMS class providing your config.
```js
import { WaveSMS, WaveSMSConfig } from '@nabcellent/wavesms';

let config: WaveSMSConfig = {
    apiKey   : process.env.WAVE_SMS_API_KEY,
    partnerId: process.env.WAVE_SMS_PARTNER_ID,
    senderId : process.env.WAVE_SMS_SENDER_ID
};

const wave = new WaveSMS(config);
```

- ### SMS
Enables you to send text messages

1. Send SMS
```js
const response = await wave.sms.text('#WaveSMSTest').to(254123456789).send()
    //  OR
const response = await wave.sms.text('#WaveSMSTest').to([254123456789]).send()

//  Expected responses
[
    {
        "respose-code": 200,
        "response-description": "Success",
        "mobile": "254123456789",
        "messageid": 75085465,
        "clientsmsid": "1234",
        "networkid": "2"
    },
    {
        "response-code": 1004,
        "response-description": "Low credit units to send message, Current balance 0.00, Required 1",
        "mobile": "254123456789",
    }
]
```

- ### Account
Enables you to check the balance of your account

1. Account balance
```js
const response = await wave.balance.fetch()

//  Expected response(number)
7.33
```