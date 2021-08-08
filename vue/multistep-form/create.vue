<template>
	<section>
		<!-- Form -->
		<div class="card mb-4 mt-3">
			<div class="card-header d-flex flex-column flex-lg-row justify-content-between align-items-center">
				<span class="text-capitalize">
					{{ !$route.params.id ? $store.getters.getTranslation('buttons.create') : $store.getters.getTranslation('buttons.update') }}
				</span>
			</div>
			<div class="card-body">
				<client-only>
					<clip-loader :loading="loading" color="#0F4D81" v-show="loading == true"></clip-loader>
					<form-wizard
					v-show="loading !== true"
					ref="wizard"
					color="#0F4D81"
					:nextButtonText="$store.getters.getTranslation('buttons.save')"
					:backButtonText="$store.getters.getTranslation('buttons.back')"
					:finishButtonText="$store.getters.getTranslation('buttons.finish')"
					errorColor="rgba(240, 63, 53, 1)"
					title=""
					subtitle="">
					<tab-content :title="$store.getters.getTranslation('titles.texts')" :before-change="() => validateStep('step1')">
						<step1 ref="step1" @on-validate="onStep1Validated"></step1> 
					</tab-content>
					<tab-content :title="$store.getters.getTranslation('titles.design')" :before-change="() => validateStep('step2')">
						<step2 ref="step2" @on-validate="onStep2Validated"></step2>
					</tab-content>
					<tab-content :title="$store.getters.getTranslation('titles.general_info')" :before-change="() => validateStep('step3')">
						<step3 ref="step3" @on-validate="onStep3Validated"></step3>
					</tab-content>
					<tab-content :title="$store.getters.getTranslation('titles.packages')" :before-change="() => validateStep('step4')">
						<step4 ref="step4" @on-validate="onStep4Validated"></step4>
					</tab-content>
				</form-wizard>
			</client-only>
		</div>
	</div>
</section>
</template>

<script>
	import {FormWizard, TabContent} from 'vue-form-wizard'
	import 'vue-form-wizard/dist/vue-form-wizard.min.css'
	import Step1 from "~/components/steps/Step1"
	import Step2 from "~/components/steps/Step2"
	import Step3 from "~/components/steps/Step3"
	import Step4 from "~/components/steps/Step4"

	export default {
		layout: 'dashboard',

		components: {
			FormWizard,
			TabContent,
			'Step1': Step1,
			'Step2': Step2,
			'Step3': Step3,
			'Step4': Step4,
		},

		data() {
			return {
				loading: true,
			}
		},

		mounted() {
			this.loading = false
		},

		methods: {
			validateStep(name) {
				var refToValidate = this.$refs[name];
				return refToValidate.validate();
			},

			toTop() {
				window.scroll({ top: 0, left: 0, behavior: 'smooth' })
			},

			onStep1Validated (data) {

			},

			onStep2Validated (data) {

			},

			onStep3Validated (data) {

			},

			onStep4Validated () {

			}
		}
	}
</script>
