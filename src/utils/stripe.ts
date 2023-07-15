export const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const strpToken = async function (card: number, month: number, year: number, cvc: number) {
    return await stripe.tokens.create({
        // Creating stripe token by card info
        card: {
            number: card,
            exp_month: month,
            exp_year: year,
            cvc: cvc,
        },
    });
};
