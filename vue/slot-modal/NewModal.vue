<template>
	<Transition name="fade">
		<div :class="[showing ? 'modal-open' : '']">
			
			<div class="modal fade" :class="[showing ? 'show' : 'hidden']" @click.self="close">
				<div class="modal-dialog" :class="size" role="document">
					<div class="modal-content-custom">
						<div class="modal-header">
							<h4 class="capitalize mb-0">{{ title }}</h4>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<slot />
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
	export default {
		name: 'NewModal',

		props: {
			title: {
				type: String,
				default: null
			},
			showing: {
				required: true,
				type: Boolean,
				default: false
			},
			size: {
				type: String,
				default: ''
			}
		},

		watch: {
			showing(value) {
				if (value) {
					return document.querySelector('body').classList.add('overflow-hidden')
				}

				document.querySelector('body').classList.remove('overflow-hidden')
			}
		},

		methods: {
			close() {
				this.$emit('close')
			}
		}
	}
</script>
