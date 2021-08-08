<template>
	<div class="flex justify-end fixed bg-gray-200 shadow px-2 py-2 rounded-sm z-50 right-0 lang-widget">
		<div v-for="(item, index) in languages" :key="index">
			<button
			type="button"
			class="btn uppercase"
			:class="[activelang == item ? 'btn-primary' : 'btn-outline-primary']"
			@click="change(item)">{{ $store.getters.showLangCode(item) }}</button>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'LanguageFormToogle',

		props: {
			languages: {
				type: Array,
				default: () => ['ua']
			},
			activelang: {
				type: String,
				default: 'ua'
			}
		},

		methods: {
			change(item) {
				this.$emit('changelang', item)
			}
		}
	}
</script>
