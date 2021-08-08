<template>
	<div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-index-2000" :class="[showingModal ? 'show-modal' : 'opacity-0 pointer-events-none']" v-if="showingModal">
		<div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" :style="{ 'min-height': minBackdropHeight + 'px' }" @click.self="$refs.closeModal.click()"></div>

		<div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto mb-8" id="customModal">
			<div class="modal-content py-4 text-left px-6">
				<!--Body-->
				<div class="text-center my-12 uppercase font-bold text-xl word-break-all">
					{{ modalInstance.title }}
				</div>

				<!--Footer-->
				<div class="flex justify-center pt-2">
					<button class="btn btn-secondary mr-2" id="rejectModal" ref="closeModal" @click="showingModal = false">
						{{ $t('buttons.cancel') }}
					</button>
					<button class="btn btn-primary " id="resolveModal" @click="showingModal = false">
						{{ modalInstance.mode == 'await' ? $t('buttons.ok') : $t('buttons.yes') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'CustomModal',

		data() {
			return {
				showingModal: false,
				modalInstance: {},
				minBackdropHeight: 341
			}
		},

		methods: {
			handleClickOutside() {
				if(this.$refs.closeModal) {
					this.$refs.closeModal.click()
				}
			},
		},

		created() {
			let self = this
			this.$bus.$on('modal', (data) => {
				self.showingModal = true
				self.$set(self, 'modalInstance', data)
			})
		}
	}
</script>
