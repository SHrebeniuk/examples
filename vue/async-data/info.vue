<template>
	<div>
		<the-header class="bg-light-pink" :languages="languages"></the-header>
		
		<main>
			<!-- Banner -->
			<LazyHydrate when-visible v-if="pageInfo.block1">
				<banner :block="pageInfo.block1"></banner>
			</LazyHydrate>

			<!-- How we work -->
			<article class="main-about-section about-section section-block" v-if="workflow.length > 0">
				<div class="container mx-auto px-0 md:px-3">
					<div v-html="pageInfo.block2[$store.state.locale].title" v-if="pageInfo.block2"></div>
					<div v-html="pageInfo.block2[$store.state.locale].description" v-if="pageInfo.block2"></div>

					<client-only>
						<light-timeline :items='workflow' class="timeline">
							<template slot='content' slot-scope='{ item }'>
						      <section class="flex flex-col md:flex-row justify-between" :class="{'last': item.last}">
						      	<h3 class="mb-2 md:mb-0 w-full md:w-1/2">{{ item.content[$store.state.locale].title }}</h3>

						      	<p class="mb-0 md:pl-8">{{ item.content[$store.state.locale].description }}</p>
						      </section>
						    </template>
						</light-timeline>
					</client-only>
				</div>
			</article>

			<!-- Stack -->
			<LazyHydrate when-visible v-if="pageInfo.block3 && technologies">
				<stack :block="pageInfo.block3" :technologies="technologies"></stack>
			</LazyHydrate>

			<!-- Contact -->
			<LazyHydrate when-visible>
				<contact></contact>
			</LazyHydrate>
		</main>

		<the-footer></the-footer>
	</div>
</template>

<script>
	import LazyHydrate from 'vue-lazy-hydration'

	export default {
		auth: false,
		
		components: {
			LazyHydrate,
			TheHeader: () => import('~/components/TheHeader.vue'),
			TheFooter: () => import('~/components/TheFooter.vue'),
			Contact: () => import('~/components/Contact.vue'),
			ImageBlock: () => import('~/components/ImageBlock.vue'),
			Banner: () => import('~/components/workflow-page/Banner.vue'),
			Stack: () => import('~/components/workflow-page/Stack.vue'),
		},

		async asyncData ({ $axios, store }) {
			let languages = store.state.locales

			const { data } = await $axios.get('/get-page-content?slug=workflow')
			const { data: workflow } = await $axios.get('/workflow', {params: {paginate: false}})
			const { data: technologies } = await $axios.get('/technologies', {params: {paginate: false, group_by_type: 1}})
			
			return {
				languages,
				pageInfo: data,
				workflow,
				technologies
			}
		},

		head () {
			return {
				title: this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_title : null,
				meta: [
					{ hid: 'description', name: 'description', content: this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_description : null },
					{ hid: 'keywords', name: 'keywords', content: this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_keywords : null }
				]
			}
		}
	}
</script>
