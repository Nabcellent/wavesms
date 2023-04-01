# WaveSMS Api

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]

[![npm version][version-badge]][package]
[![bundle size][minzip-badge]][bundlephobia]
[![npm downloads][downloads-badge]][npmtrends]
[![apache license][license-badge]][license]

[build-badge]: https://img.shields.io/github/actions/workflow/status/nabcellent/wavesms/test.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/nabcellent/wavesms/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/nabcellent/wavesms.svg?token=UR29MJXL82&style=flat-square
[coverage]: https://codecov.io/github/nabcellent/wavesms/
[version-badge]: https://img.shields.io/npm/v/@nabcellent/wavesms.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nabcellent/wavesms
[minzip-badge]: https://img.shields.io/bundlephobia/minzip/@nabcellent/wavesms.svg?style=flat-square
[bundlephobia]: https://bundlephobia.com/result?p=@nabcellent/wavesms
[downloads-badge]: https://img.shields.io/npm/dm/@nabcellent/wavesms.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/nabcellent/wavesms
[license-badge]: https://img.shields.io/npm/l/@nabcellent/wavesms.svg?style=flat-square
[license]: https://github.com/nabcellent/wavesms/blob/main/LICENSE

This is a <i>Typescript</i> package that interfaces with the [WaveSMS](https://wavesms.com/) Api.
The API enables you to initiate mobile Sms notifications.

## Documentation

### Installation

You can install the package via npm or yarn:
```bash
yarn add @nabcellent/wavesms
```
### Getting Started
Initialize the WaveSMS class with your config.
```js
import { WaveSMS, WaveSMSConfig } from '@nabcellent/wavesms';

let config: WaveSMSConfig = {
    apiKey   : process.env.WAVE_SMS_API_KEY,
    partnerId: process.env.WAVE_SMS_PARTNER_ID,
    senderId : process.env.WAVE_SMS_SENDER_ID
};

const wave = new WaveSMS(config);
```

- ### Sms
Enables you to send text messages

#### 1. Send Sms
```js
const response = await wave.sms.text('#WaveSMSTest').to(254123456789).send()
    //  OR
const response = await wave.sms.text('#WaveSMSTest').to([254123456789]).send()

//  Expected responses
[
    {
        code: 200,
        description: "Success",
        mobile: "254123456789",
        message_id: 75085465,
        client_sms_id: "1234",
        network_id: "2"
    },
    {
        code: 1004,
        description: "Low credit units...",
        mobile: "254123456789",
    }
]
```

#### 2. Schedule Sms
Provide a Moment or Date instance to the send method.
```js
const response = await wave.sms.text('#WaveSMSTest').to(254123456789).send(new Date('2023-12-20'))
```
<small><i>PS: The date must be after current time.</i>🌚</small>

#### 3. Get Delivery Report
```js
//  Provide Message ID
const response = await wave.sms.getDeliveryReport("123456789")

//  Expected response
{
    code: 200,
    message_id: "123456789",
    description: "Success",
    delivery_status: 32,
    delivery_description: "DeliveredToTerminal",
    delivery_tat: "00:00:06",
    delivery_networkid: 1,
    delivery_time: "2023-02-18 21:16:22"
}
```

#### 3. Calculate SMS Cost
Provide the text message.
```js
const response = wave.sms.cost('Hello World.')

//  Expected response(number)
0.2
```

---

- ### Account
Enables you to check the balance of your account

1. Account balance
```js
const response = await wave.balance.fetch()

//  Expected response(number)
7.33
```
## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email [nabcellent.dev@gmail.com](mailto:nabcellent.dev@gmail.com) instead of using the issue tracker.

## Credits

- [Nabcellent](https://github.com/Nabcellent)

[comment]: <> (- [All Contributors]&#40;../../contributors&#41;)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.