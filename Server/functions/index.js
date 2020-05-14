const functions = require('firebase-functions');

const stripe = require('stripe')(functions.config().stripe.token);

exports.payWithStripe = functions.https.onRequest((request, response) => {
	console.log(request.body.amount, request.body.currency, request.body.token);
	stripe.charges
		.create({
			amount: request.body.amount,
			currency: request.body.currency,
			source: request.body.token,
		})
		.then((charge) => {
			// asynchronously called
			response.send(charge);
		})
		.catch((err) => {
			console.log(err);
			response.send(err);
		});
});
