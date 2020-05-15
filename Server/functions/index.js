const functions = require('firebase-functions');

const stripe = require('stripe')(functions.config().stripe.token);

exports.payWithStripe = functions.https.onRequest((request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
	response.set('Access-Control-Allow-Headers', '*');

	if (request.method === 'OPTIONS') {
		response.end();
	} else {
		console.log(request.body.amount, request.body.currency, request.body.token);
		stripe.charges
			.create({
				amount: request.body.amount,
				currency: request.body.currency,
				source: request.body.token,
			})
			.then((charge) => {
				// asynchronously called
				return response.send(charge);
			})
			.catch((err) => {
				console.log(err);
				return response.send(err);
			});
	}
});
