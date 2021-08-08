<template>
  <div>
    <spinner
      v-if="loading"
      class="my-32 w-full"
    />

    <div
      v-else
      class="flex flex-wrap items-start"
    >
      <div
        v-for="(card, index) in userPaymentMethods"
        :key="'card-' + index"
        class="flex mr-6 mb-6 card-border py-2 px-4 payment-card-block"
        :class="{'active': activeCard == card.id }"
      >
        <div class="flex items-center flex-grow">
          <div
            class="custom-radio flex justify-center items-center mr-3 cursor-pointer"
            @click="updateCurrentCard(card.id)"
          >
            <div class="rounded-item" />
          </div>

          <img
            v-if="card.card"
            :src="`/images/icons/${card.card.brand}.svg`"
            alt="card icon"
          >

          <div
            v-if="card.billing_details"
            class="flex flex-col mr-1 py-2 ml-4"
          >
            <p class="mb-2 fs-14-bold">
              {{ card.billing_details.name }}
            </p>
            <p
              v-if="card.card"
              class="mb-2 fs-14-bold"
            >
              XXXX XXXX XXXX {{ card.card.last4 }}
            </p>
            <p
              v-if="card.card"
              class="fs-13-semibold"
            >
              {{ convertExpDate(card.card) }}
            </p>
          </div>
        </div>

        <a
          :id="`remove-payment-${index}`"
          role="button"
          class="opacity-7"
          @click="askRemovePaymentMethod(card)"
        >
          <i class="ri-close-line" />
        </a>
      </div>

      <div
        id="open-new-card-modal"
        class="new-payment-card-block flex justify-center items-center text-blue fs-14-bold uppercase cursor-pointer"
        @click="openModal"
      >
        <i class="ri-add-line mr-4" />
        {{ $t('payment_method.add_new_card_button') }}
      </div>
    </div>

    <!-- New payment method -->
    <div
      v-show="showModal"
      tabindex="0"
      class="opacity-0 z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed"
      :class="{ 'opacity-100': showModal }"
    >
      <div
        class="z-50 relative p-3 mx-auto my-0 max-w-full min-h-screen flex items-center modal-lg"
      >
        <div class="modal-body flex flex-col justify-center items-center py-3 px-4 mb-12">
          <div class="flex justify-end w-full">
            <a
              role="button"
              class="without-decoration"
              @click="closeModal"
            >
              <i class="ri-close-line" />
            </a>
          </div>

          <form
            class="flex flex-wrap"
            @submit.prevent="formCreateToken"
          >
            <div class="flex flex-col w-full px-2 mb-5">
              <label class="fs-13-semibold mb-4">{{ $t('payment_method.name_on_card') }}</label>
              <div
                class="w-full flex items-start stripe-custom-element"
                :class="{'br-red': cardNameValidation}"
              >
                <input
                  id="card-name"
                  v-model="cardName"
                  type="text"
                  :placeholder="$t('payment_method.card_name_placeholder')"
                  class="w-full stripe-card-name"
                >
              </div>
            </div>
            <div class="flex flex-col w-full px-2 mb-5">
              <label class="fs-13-semibold mb-4">{{ $t('payment_method.card_number') }}</label>
              <div
                id="card-number"
                class="w-full stripe-custom-element"
              />
            </div>

            <div class="flex flex-col w-1/2 px-2 mb-5">
              <label class="fs-13-semibold mb-4">{{ $t('payment_method.exp_date') }}</label>
              <div
                id="card-expiry"
                class="w-full stripe-custom-element"
              />
            </div>

            <div class="flex flex-col w-1/2 px-2 mb-5">
              <label class="fs-13-semibold mb-4">{{ $t('payment_method.cvv') }}</label>
              <div
                id="card-cvc"
                class="w-full stripe-custom-element"
              />
            </div>

            <div
              v-if="stripeError"
              class="flex px-2 w-full"
            >
              <div
                id="card-error"
                class="text-red"
              >
                {{ stripeError }}
              </div>
            </div>

            <div class="flex px-2 w-full mb-6 pt-1">
              <a
                :href="$t('payment_method.stripe_link')"
                target="_blank"
                class="fs-13-semibold text-darkgrey"
              >{{ $t('payment_method.stripe_description') }}</a>
            </div>

            <div class="flex justify-end w-full px-2 mt-4 mb-4">
              <button
                id="add-new-card-button"
                :disabled="loadindStripe"
                class="btn-blue uppercase medium-btn"
                @click="createToken"
              >
                {{ $t('payment_method.add_card') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-modal-backdrop" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';

export default {
	emits: ['get-default-card', 'loaded-list', 'get-stripe-error', 'get-stripe-token'],

	data() {
		return {
			loadindStripe: false,
			loading: true,
			activeCard: null,
			userPaymentMethods: [],
			showModal: false,
			cardNameValidation: false,

			// Stripe
			token: null,
			cardName: '',
			cardNumber: null,
			cardExpiry: null,
			cardCvc: null,
			stripeError: null,
			clientSecret: null,
		};
	},

	computed: {
		stripeElements() {
			return this.$stripe.elements({
				fonts: [
					{
						cssSrc: 'https://fonts.googleapis.com/css?family=Mulish',
					},
				],
			});
		},
	},

	watch: {
		cardName(val) {
			if (val) {
				this.cardNameValidation = false;
			}
		},
	},

	beforeUnmount() {
		if (this.cardNumber) {
			this.cardNumber.destroy();
			this.cardExpiry.destroy();
			this.cardCvc.destroy();
		}
	},

	mounted() {
		setTimeout(() => {
			const { StripePlugin } = require('@vue-stripe/vue-stripe');
			Vue.use(StripePlugin, this.$store.state.stripeOptions);
		}, 200);
	},

	created() {
		this.getClientSecret();

		this.getClientPaymentMethods();
	},

	methods: {
		updateCurrentCard(paymentMethod) {
			this.activeCard = paymentMethod;
			this.$emit('get-default-card', paymentMethod);
		},

		convertExpDate(card) {
			const month = card.exp_month < 10 ? `0${card.exp_month}` : card.exp_month;
			const year = card.exp_year.toString().substring(2);

			return `${month}/${year}`;
		},

		openModal() {
			this.showModal = true;

			if (!this.cardNumber) {
				setTimeout(() => {
					this.buildStripeForm();
				}, 100);
			}
		},

		buildStripeForm() {
			const style = this.$store.state.stripeStyle;
			this.cardNumber = this.stripeElements.create('cardNumber', {
				style,
				placeholder: this.$t('payment_method.card_number_placeholder'),
			});
			this.cardNumber.mount('#card-number');
			this.cardExpiry = this.stripeElements.create('cardExpiry', {
				style,
				placeholder: this.$t('payment_method.exp_date_placeholder'),
			});
			this.cardExpiry.mount('#card-expiry');
			this.cardCvc = this.stripeElements.create('cardCvc', {
				style,
				placeholder: this.$t('payment_method.cvv_placeholder'),
			});
			this.cardCvc.mount('#card-cvc');

			setTimeout(() => {
				// Set cardnumber frame id
				document.getElementById('card-number').getElementsByTagName('iframe')[0].id = 'cardnumber-frame';

				// Set cardexpiry frame id
				document.getElementById('card-expiry').getElementsByTagName('iframe')[0].id = 'cardexpiry-frame';

				// Set cardncvc frame id
				document.getElementById('card-cvc').getElementsByTagName('iframe')[0].id = 'cardcvc-frame';
			}, 300);
		},

		closeModal() {
			this.showModal = false;

			this.clearForm();
		},

		clearForm() {
			if (this.cardNumber) {
				this.cardNumber.destroy();
				this.cardExpiry.destroy();
				this.cardCvc.destroy();
				this.cardName = '';

				this.cardNumber = null;
				this.cardExpiry = null;
				this.cardCvc = null;
			}
		},

		async createToken() {
			this.stripeError = null;

			this.loadindStripe = true;

			this.$emit('loaded-list', true);

			this.cardNameValidation = !this.cardName;

			if (this.cardNameValidation) {
				this.loadindStripe = false;
				return;
			}

			const { setupIntent, error } = await this.$stripe.confirmCardSetup(this.clientSecret, {
				payment_method: {
					card: this.cardNumber,
					billing_details: { name: this.cardName },
				},
			});

			if (error) {
				this.stripeError = error.message;
				this.$toast.error(error.message);
				this.$emit('get-stripe-error', error);

				this.$emit('loaded-list', false);

				this.loadindStripe = false;

				return;
			}

			this.loading = true;

			this.createPaymentMethod(setupIntent);

			this.$emit('get-stripe-token', setupIntent);

			this.$emit('get-default-card', setupIntent.payment_method);

			this.showModal = false;

			this.clearForm();
		},

		createPaymentMethod(setupIntentData) {
			this.$axios.put('users/add-payment-method', {
				payment_method: setupIntentData.payment_method,
			})
				.then((response) => {
					this.updateCurrentPaymentMethods(response);

					this.loading = false;
					this.loadindStripe = false;
					this.$emit('loaded-list', false);
				})
				.catch((error) => {
					this.$toast.error(this.$store.getters.getErrors(error.response.data));
					this.loading = false;
					this.loadindStripe = false;
					this.$emit('loaded-list', false);
				});
		},

		updateCurrentPaymentMethods(response) {
			this.userPaymentMethods = response.data.payment_methods;

			if (response.data.default_payment_method && response.data.default_payment_method.id) {
				this.activeCard = response.data.default_payment_method.id;
				this.$emit('get-default-card', response.data.default_payment_method.id);
			} else if (response.data.payment_methods && response.data.payment_methods[0] && response.data.payment_methods[0].id) {
				this.activeCard = response.data.payment_methods[0].id;
				this.$emit('get-default-card', response.data.payment_methods[0].id);
			}

			if (!this.userPaymentMethods.length) {
				this.openModal();
			}
		},

		getClientSecret() {
			this.$axios.get('/users/get-setup-intent')
				.then((response) => {
					this.clientSecret = response.data.setup_intent;
				})
				.catch((error) => {
					if (this.$toast) {
						this.$toast.error(this.$store.getters.getErrors(error.response.data));
					}
				});
		},

		getClientPaymentMethods() {
			this.$axios.get('/users/get-payment-methods')
				.then((response) => {
					this.updateCurrentPaymentMethods(response);

					this.loading = false;
					this.$emit('loaded-list', false);
				})
				.catch((error) => {
					if (this.$toast) {
						this.$toast.error(this.$store.getters.getErrors(error.response.data));
					}
					this.loading = false;
					this.$emit('loaded-list', false);
				});
		},

		formCreateToken(e) {
			e.preventDefault();

			this.createToken();
		},
	},
};
</script>
