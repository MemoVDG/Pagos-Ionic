import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stripe } from '@ionic-native/stripe/ngx';

@Component({
	selector: 'app-stripe-payment',
	templateUrl: './stripe-payment.page.html',
	styleUrls: ['./stripe-payment.page.scss'],
})
export class StripePaymentPage implements OnInit {
	paymentAmount: string = '5';
	currency: string = 'MXN';
	currencyIcon: string = '$';
	stripe_key = 'pk_test_OM8p9wErTw3mGsabYSUUjApO00GnyUuGEx';
	cardDetails: any = {};

	ccNumber: string;
	ccMonth: string;
	ccYear: string;
	ccCVV: string;

	isValid: boolean = true;

	constructor(private stripe: Stripe, private http: HttpClient) {}

	ngOnInit() {}

	validateCard() {
		console.log(this.ccNumber, this.ccMonth, this.ccYear, this.ccCVV);
		// Validate CARD
		this.stripe
			.validateCardNumber(this.ccNumber)
			.then((res) => {
				// Validate date
				this.stripe
					.validateExpiryDate(this.ccMonth, this.ccYear)
					.then((res) => {
						this.stripe
							// Validate CVV
							.validateCVC(this.ccCVV)
							.then((res) => {
								this.isValid = true;
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	payWithStripe() {
		this.stripe.setPublishableKey(this.stripe_key);

		this.cardDetails = {
			number: '4242424242424242',
			expMonth: 12,
			expYear: 2020,
			cvc: '220',
		};

		/* this.cardDetails = {
			number: this.ccNumber,
			expMonth: this.ccMonth,
			expYear: this.ccYear,
			cvc: this.ccCVV,
		}; */

		this.stripe
			.createCardToken(this.cardDetails)
			.then((token) => {
				console.log(token);
				// this.makePayment(token.id);
			})
			.catch((error) => console.error(error));
	}
}
