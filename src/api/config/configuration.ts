export default () => {
    return {
        smtp: {
            service: process.env.SMTP_SERVICE,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD,
        },
    }
}