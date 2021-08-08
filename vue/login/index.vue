<template>
  <div class="flex w-full bg-white">
    <!-- Log in block -->
    <div class="w-full min-h-screen login-block flex flex-col justify-between">
        <form
          class="flex flex-col"
          @submit="login"
        >
          <h2 class="font-extrabold text-2xl mb-9 text-darkblue">
            {{ $t('login_page.log_in') }}
          </h2>

          <div class="flex flex-col px-4 mb-10">
            <label
              for="login-email"
              class="label"
            >{{ $t('login_page.email_label') }}</label>
            <div class="flex items-center relative">
              <i class="ri-mail-line text-darkblue mr-2 opacity-4 absolute left-0 text-xl" />
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                required=""
                :placeholder="$t('login_page.email_placeholder')"
                class="py-5 pl-8 w-full input-bottom-line"
              >
            </div>
          </div>

          <div class="flex flex-col px-4 mb-10">
            <label
              for="login-password"
              class="label"
            >{{ $t('login_page.password_label') }}</label>
            <div class="flex items-center relative">
              <i class="ri-lock-2-line text-darkblue mr-2 opacity-4 absolute left-0 text-xl" />
              <input
                id="login-password"
                v-model="form.password"
                required
                :type="[showPass ? 'text' : 'password']"
                :placeholder="$t('login_page.password_placeholder')"
                class="py-5 px-8 w-full input-bottom-line"
              >
              <a
                role="button"
                class="without-decoration"
                @click="showPass = !showPass"
              >
                <i
                  class="text-darkblue opacity-4 absolute right-0 text-xl top-6"
                  :class="[showPass ? 'ri-eye-off-line' : 'ri-eye-line']"
                />
              </a>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center px-4 mb-14">
            <n-link
              id="reset-password-link"
              :to="localePath('/reset-password')"
              class="text-darkblue opacity-4 fs-14-semibold"
            >
              {{ $t('login_page.forgot_password') }}
            </n-link>
          </div>

          <div class="px-4">
            <button
              type="submit"
              class="btn-blue uppercase w-full bold-btn"
              :disabled="loading"
            >
              {{ $t('login_page.login_button') }}
            </button>
          </div>

          <div class="flex justify-center items-center my-12 px-4">
            <div class="separator" />
            <div class="text-darkblue opacity-4 mx-3">
              {{ $t('login_page.or') }}
            </div>
            <div class="separator" />
          </div>

          <!-- Social auth -->
          <div class="px-4">
            <a
              role="button"
              class="flex justify-center items-center capitalize py-4 mb-4 social-auth-btn fs-14-semibold"
              @click="useAuthProvider('google')"
            >
              <img
                src="~/assets/images/icons/google.svg"
                alt="google icon"
                class="mr-4"
              >
              {{ $t('login_page.google_login_button') }}
            </a>
          </div>
        </form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'Login',

	layout: 'login',

	auth: false,

	data() {
		return {
			showPass: false,
			loading: false,
			form: {},
		};
	},

	methods: {
		...mapMutations({
			updateHeader: 'SET_HEADER',
		}),

		useAuthProvider(provider) {
			window.location.href = `${process.env.API_URL}/auth/login/${provider}`;
		},

		login(e) {
			e.preventDefault();

			this.loading = true;

			this.$auth.loginWith('custom', {
				data: this.form,
			})
				.then((response) => {
					this.updateHeader(this);
					this.$router.push(this.localeLocation({ path: '/dashboard' }));
					this.loading = false;
				})
				.catch((error) => {
					this.$toast.error(this.$store.getters.getErrors(error.response.data));
					this.loading = false;
				});
		},
	},
};
</script>
