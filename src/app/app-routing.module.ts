import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomePageModule),
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: 'stripe-payment',
		loadChildren: () =>
			import('./stripe-payment/stripe-payment.module').then(
				(m) => m.StripePaymentPageModule
			),
	},
	{
		path: 'paypal-payment',
		loadChildren: () =>
			import('./paypal-payment/paypal-payment.module').then(
				(m) => m.PaypalPaymentPageModule
			),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
