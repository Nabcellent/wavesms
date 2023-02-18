import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { WaveSMS } from "./client";
import { CustomError } from "./exceptions/custom.err";
import { log } from "./utils/logger";
import path from "path";

let app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', async (req, res, next) => {
    try {
        const wave = new WaveSMS({
            apiKey: "f9b17c5852313b3a5600ed570a736b87",
            partnerId: "6855"
        })

        // const response = await wave.sms.text('#WaveSMSTest').to(254110039317).send()
        const response = await wave.balance.fetch()

        res.json(response);
    } catch (e) {
        next(e)
    }
});
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const message = error.message || 'Something went wrong';

    if (error instanceof CustomError) {
        let errorResponse = error.serializeErrors().length > 1
            ? { result: 0, errors: error.serializeErrors() }
            : { result: 0, message: error.serializeErrors()[0].message };

        return res.status(error.statusCode).send(errorResponse);
    }

    log.error(error);

    res.status(500).send({ result: 0, message });
})

app.listen(3000, () => {
    log.info(`\n\n  Server started on port: ${3000}\n\n  --> Local: http://localhost:${3000}`);
});
