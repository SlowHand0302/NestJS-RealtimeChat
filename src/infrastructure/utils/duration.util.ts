export function parseDurationToMs(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    switch (unit) {
        case 'd':
            return value * 86400000;
        case 'h':
            return value * 3600000;
        case 'm':
            return value * 60000;
        case 's':
            return value * 1000;
        default:
            return 0;
    }
}
