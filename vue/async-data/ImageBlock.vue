<template>
	<div v-if="imageUrl && image_base_url">
		<img v-lazy="getUrlSvg + '.svg'" :alt="imageUrl" v-if="imageExtension == 'svg'" :class="imgClass">
		<img v-lazy="getUrl" :alt="imageUrl" :class="imgClass" v-else>
	</div>
</template>
<script>
	export default {
		name: 'ImageBlock',

		props: {
			image: {
				type: Object
			},
			imgClass: {
				type: String,
				default: 'w-full'
			}
		},

		computed: {
			imageUrl() {
				return this.image && this.image.image_url
			},

			imageExtension() {
				return this.image && this.image.extension
			},

			browserIdentify() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.indexOf('safari') != -1) {
					if (ua.indexOf('chrome') > -1) {
						return '.webp'
					} else {
						return '.png'
					}
				} else {
					return '.webp'
				}
			},

			getUrl() {
				if(this.image) {
					let image_url = this.imageUrl;

					if (!image_url || !this.image_base_url) {
						return null;
					}

					return this.image_base_url + image_url + this.browserIdentify

				}
			},

			getUrlSvg() {
				let image_url = this.imageUrl;

				if (!image_url || !this.image_base_url) {
					return null;
				}

				return this.image_base_url + image_url
			}
		},

		data() {
			return {
				image_base_url: null,
			}
		},

		mounted() {
			this.image_base_url = process.env.API_BASE_URL
		},
	}
</script>
