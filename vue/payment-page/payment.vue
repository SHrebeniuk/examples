<template>
  <div>
    <div class="flex justify-between items-center mb-9">
      <PageTitle
        :title="$t('payment_method.payment_title')"
        :subtitle="$t('payment_method.payment_subtitle')"
      />
    </div>

    <div class="card flex flex-col justify-between min-h-568">
      <!-- New Payment Method -->
      <stripe-card
        @get-stripe-error="getStripeError"
        @get-stripe-token="getSuccessToken"
      />
    </div>
  </div>
</template>
<script>
export default {
	name: 'PaymentPage',

	data() {
		return {

		};
	},

	head() {
		return {
			script: [
				{ src: 'https://js.stripe.com/v3' },
			],
		};
	},

	methods: {
		getStripeError() {
			// console.log(error)
		},

		getSuccessToken() {
			// console.log(token)
		},
	},
};
</script>
