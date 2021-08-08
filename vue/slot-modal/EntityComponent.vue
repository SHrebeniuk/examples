<template>
	<new-modal :showing="showing" :title="title" @close="close">
		<!--Title-->
		<div class="alert alert-danger text-center mt-3" role="alert" v-if="errorModal">
			{{ errorModalMsg }}
		</div>

		<!--Body-->
		<div class="row form-group">
			<div class="col-lg-3 flex items-center">
				<label class="mb-0">{{ $t('inputs.article') }}</label>
			</div>
			<div class="col-lg-9">
				<v-select
				class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 py-1 px-2"
				label="name"
				v-model="form.article"
				:get-option-label="getLabel"
				:options="$store.state.data.articles"/>
			</div>
		</div>

		<div class="pt-2" v-for="(item, index) in $store.state.locales" :key="index">
			<custom-input :title="`${inputLabel} (${$store.getters.showLangCode(item)})`" :field="`item_title-${item}`" v-model="form.content[item].title" v-if="form.content[item]" />
		</div>

		<!--Footer-->
		<div class="flex justify-center pt-4">
			<button class="btn btn-secondary mr-2" @click="close">{{ $t('buttons.cancel') }}</button>
			<button class="modal-close btn btn-primary" @click="sendForm">{{ form._id ? $t('buttons.update') : $t('buttons.create') }}</button>
		</div>
	</new-modal>
</template>
<script>
	export default {

		props: {
			title: {},
			showing: {
				type: Boolean,
				default: false
			},
			activelang: {},
			url: {
				default: null
			}
		},

		data() {
			return {
				errorModalMsg: null,
				errorModal: false,
				form: {
					article: null,
					content: {}
				},
			}
		},

		watch: {
			'showing'(val) {
				if(val) {
					let params = {
						url: '/articles',
						fieldName: 'articles',
						params: {paginate: false, free: 1}
					}
					this.$store.dispatch('data/loadItems', params)
				}
			}
		},

		computed: {
			inputLabel() {
				return this.title == this.$t('inputs.persone') ?
				this.$t('table.title') :
				this.$t('inputs.title')
			}
		},

		methods: {
			close() {
				this.$emit('close')
			},

			createNew() {
				this.form.article = null

				this.form._id = null
				this.errorModal = false

				this.$store.state.locales.forEach(item => {
					this.$set(this.form.content, item, {
						title: null
					})
				})
			},

			showItem(item) {
				this.$set(this, 'form', JSON.parse(JSON.stringify(item)))
			},

			getLabel(opt) {
				return opt.content && opt.content[this.activelang] ? opt.content[this.activelang].title : opt.name
			},

			sendForm() {
				this.$axios.put(this.url, this.form)
				.then(response => {
					this.$emit('success', response.data)
				})
				.catch(error => {
					this.errorModalMsg = error.response && error.response.data && error.response.data.message ? error.response.data.message : error
					this.errorModal = true
				})
			},
		}
	}
</script>
