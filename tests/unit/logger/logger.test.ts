import { afterEach, describe, expect, it, vi } from "vitest";
import { createLogger, format, transports } from "winston";
import { log } from "../../../src/utils/logger";

describe('logger', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should pass', () => {
        log.info('Hello world');

        expect(format.combine).toBeCalledTimes(1);

        expect(format.align).toBeCalledTimes(1);
        expect(format.colorize).toBeCalledWith({ all: true });
        expect(format.printf).toBeCalledWith(expect.any(Function));
        expect(format.timestamp).toBeCalledWith({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' });

        expect(transports.Console).toHaveBeenNthCalledWith(1, { level: 'info' });
        expect(transports.File).toBeCalledWith({ filename: 'logs/wavesms.log', level: 'debug' });

        expect(createLogger).toBeCalledTimes(1);
    });
})