import { HttpException } from "@nestjs/common";
const signale = require('signale');

export const ErrHandler = (STATUS, MESSAGE, CONSOLE = null) => {
    signale.error("Signale Error at: " + CONSOLE)
    return new HttpException(
        {
            statusCode: STATUS,
            error: `${MESSAGE}`,
        },
        STATUS,
    );
}