import { vi } from "vitest";

vi.mock('winston', () => ({
    config: {
        syslog: []
    },
    format: {
        align: vi.fn(),
        colorize: vi.fn(),
        combine: vi.fn(),
        printf: vi.fn(),
        timestamp: vi.fn(),
    },
    transports: {
        Console: vi.fn(),
        File: vi.fn(),
    },
    createLogger: vi.fn(() => ({
        info: vi.fn(),
    })),
}));