import { Component, OnInit } from '@angular/core';
import {
	PayPal,
	PayPalPayment,
	PayPalConfiguration,
} from '@ionic-native/paypal/ngx';

import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Component({
	selector: 'app-paypal-payment',
	templateUrl: './paypal-payment.page.html',
	styleUrls: ['./paypal-payment.page.scss'],
})
export class PaypalPaymentPage implements OnInit {
	constructor(private payPal: PayPal, public httpClient: HttpClient) {}

	ngOnInit() {}

	// Payment variables
	paymentAmount: string = '5';
	currency: string = 'MXN';
	currencyIcon: string = '$';
	paymentSuccess: boolean = false;
	paymentError: boolean = false;

	// API variables
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	};

	apiUrl = 'http:localhost:3000/api/';

	// Handle API errors
	handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` + `body was: ${error.error}`
			);
		}
		// return an observable with a user-facing error message
		return throwError('Something bad happened; please try again later.');
	}

	payWithPaypal() {
		this.payPal
			.init({
				PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
				PayPalEnvironmentSandbox:
					'Afhz3MMaJFz5dAaFaJIeO131ZcJlKosphWSC9y9PctOgPArlsEOg9YTwSlxT4hrt5aUaPaaBIX904aB8',
			})
			.then(
				() => {
					// Pass the client key for production or sandbox
					this.payPal
						.prepareToRender(
							'PayPalEnvironmentSandbox',
							// If the product is for shipping pass the shipping information
							new PayPalConfiguration({})
						)
						.then(
							() => {
								// Pass the basic information for the payment
								let payment = new PayPalPayment(
									this.paymentAmount,
									this.currency,
									'Test product',
									'Sale'
								);
								this.payPal.renderSinglePaymentUI(payment).then(
									(res) => {
										// If the payment was success
										console.log(res);
										// Send data to API and wait for response
										this.httpClient
											.post(this.apiUrl, res.response, this.httpOptions)
											.pipe(catchError(this.handleError));
										this.paymentSuccess = true;
									},
									() => {
										// Error or render dialog closed without being successful
										console.log(
											'Error or render dialog closed without being successful'
										);
										this.paymentError = true;
									}
								);
							},
							() => {
								// Error in configuration
								console.log('Error in configuration');
								this.paymentError = true;
							}
						);
				},
				() => {
					// Error in initialization, maybe PayPal isn't supported or something else
					console.log(
						'Error in initialization, maybe PayPal isnt supported or something else'
					);
					this.paymentError = true;
				}
			);
	}
}
