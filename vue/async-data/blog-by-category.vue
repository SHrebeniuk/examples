<template>
    <div>
        <the-header class="bg-light-blue" :languages="languages"></the-header>

        <main>
            <!-- Banner -->
            <article class="bg-light-blue main-header-section flex flex-col items-between justify-between py-16 section-block" v-if="pageInfo.block1">
                <div></div>
                <div class="container mx-auto flex flex-row items-center">
                    <div class="flex flex-col">
                        <div v-html="pageInfo.block1[$store.state.locale].title"></div>
                        <div v-html="pageInfo.block1[$store.state.locale].description"></div>
                    </div>

                    <div class="pl-8">
                        <image-block :image="pageInfo.block1[$store.state.locale].image" class="col" />
                    </div>
                </div>

                <div class="container mx-auto flex blog-categories">
                    <template v-if="pageInfo.show_categories">
                        <a href="#">{{ $store.getters.getTranslation('all_topics') }}</a>
                        <a href="#">{{ $store.getters.getTranslation('our_company') }}</a>
                        <a href="#">{{ $store.getters.getTranslation('front_end_development') }}</a>
                        <a href="#">{{ $store.getters.getTranslation('back_end') }}</a>
                        <a href="#">{{ $store.getters.getTranslation('all_topics') }}</a>
                        <a href="#">{{ $store.getters.getTranslation('our_company') }}</a>
                    </template>
                </div>
            </article>

            <!-- Posts -->
            <article class="posts-section section-block">
                <div class="container mx-auto">
                    <div class="flex flex-wrap blog-row">
                        <div class="w-2/3 blog-col flex flex-col">
                            <div class="post-xl" v-for="(item, index) in posts.ordinary" :key="index">
                                <n-link :to="{name: 'post_show_front', params: {slug: item.slug}}">
                                    <div v-if="!item.image" class="post-xl-poster" :style="{ backgroundImage: 'url(' + '/project2.png' + ')' }"></div>
                                    <div v-else class="post-xl-poster image-post-div">
                                        <image-block :image="item.image" :imgClass="`image-post`"/>
                                    </div>
                                </n-link>
                                <div class="px-4">
                                    <div class="flex justify-between my-4" v-if="item.category">
                                        <span>{{ item.category.content[$store.state.locale].title }}</span>
                                        <p class="mb-0">{{$store.getters.getLocalizedTimestamp(item.created_at)}}</p>
                                    </div>
                                    <n-link :to="{name: 'post_show_front', params: {slug: item.slug}}">
                                        <h4>{{ item.content[$store.state.locale].title }}</h4>
                                    </n-link>
                                    <h5>{{ item.content[$store.state.locale].short_description }}</h5>
                                    <div class="flex items-center" v-if="$store.getters.getObjectField(item, 'user.teammember')">
                                        <image-block :image="$store.getters.getObjectField(item, 'user.teammember.image')"/>
                                        <small class="font-medium">{{$store.getters.getObjectField(item, `user.teammember.content.${$store.state.locale}.name`)}}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/3 blog-col flex flex-col">
                            <div class="post-sm" v-for="(item, index) in posts.top" :key="index">
                                <n-link :to="{name: 'post_show_front', params: {slug: item.slug}}">
                                    <div v-if="!item.image" class="post-sm-poster image-post-div" :style="{ backgroundImage: 'url(' + '/project2.png' + ')' }"></div>
                                    <div v-else class="post-sm-poster image-post-div">
                                        <image-block :image="item.image" :imgClass="`image-post`"/>
                                    </div>
                                </n-link>
                                <div class="px-4">
                                    <div class="flex justify-between my-4" v-if="item.category">
                                        <a :href="`/${$store.state.locale}/category/${ item.category.slug ? item.category.slug : item.category._id + '?id_show=1' }`" class="text-purple" v-if="item.category">{{ item.category.content[$store.state.locale].title }}</a>
                                        <p class="mb-0">{{$store.getters.getLocalizedTimestamp(item.created_at)}}</p>
                                    </div>
                                    <n-link :to="{name: 'post_show_front', params: {slug: item.slug}}">
                                        <h4>{{ item.content[$store.state.locale].title }}</h4>
                                    </n-link>
                                    <div class="flex items-center" v-if="$store.getters.getObjectField(item, 'user.teammember')">
                                        <image-block :image="$store.getters.getObjectField(item, 'user.teammember.image')"/>
                                        <small class="font-medium" v-if="$store.getters.getObjectField(item, 'user.teammember')">{{$store.getters.getObjectField(item, `user.teammember.content.${$store.state.locale}.name`)}}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </article>

        </main>

        <the-footer></the-footer>
    </div>
</template>
<script>
    export default {
        auth: false,

        components: {
            TheHeader: () => import('~/components/TheHeader.vue'),
            TheFooter: () => import('~/components/TheFooter.vue'),
            ImageBlock: () => import('~/components/ImageBlock.vue'),
        },

        async asyncData ({ $axios, store }) {
            let languages = store.state.locales

            const { data } = await $axios.get('/get-page-content?slug=blog')
            return {
                languages,
                pageInfo: data,
            }
        },

        data() {
            return {
                category_id: null,
                dop_params: null,
                posts: {},
                meta_tags: {
                    title: null,
                    description: null,
                    keywords: null
                }
            }
        },

        mounted() {
            this.category_id = this.$route.params.slug ? this.$route.params.slug : 'hren'
            this.dop_params = this.$route.query && this.$route.query.id_show ? this.$route.query.id_show : null

            let url = this.$route.name == 'category_show_front' ? '/categories-get/' : '/tags-get/'
            this.$axios.get(url + this.category_id, {params: {paginate: false, group_by_is_top: 1, published: 1, id_show: this.dop_params ? this.dop_params : ''}})
                .then(response => {
                    this.posts = response.data

                    if (url == '/categories-get/') {
                        this.getMetaTags('/categories-meta/')
                    } else {
                        this.getMetaTags('/tags-meta/')
                    }
                })
                .catch(error => {
                    this.$modal.open({ title: error.response.data.message || error.response.data.message == '' ? error.response.data.message : error.response.data })
                })
        },

        methods: {
            getMetaTags(url) {
                if (url == '/categories-meta/') {
                    let meta_title_content = this.$store.getters.getTranslation('link_blog')
                    let meta_keywords_content = this.$store.getters.getTranslation('this_pages_blog')
                    let meta_description_content = this.$store.getters.getTranslation('blog_keywords')
                } else {
                    let meta_title_content = this.$store.getters.getTranslation('tags')
                    let meta_keywords_content = this.$store.getters.getTranslation('this_is_page_tag_keywords')
                    let meta_description_content = this.$store.getters.getTranslation('this_is_a_page_tag_description')
                }

                this.$axios.get(url + this.category_id, {params: {id_show: this.dop_params ? this.dop_params : ''}})
                    .then(response => {
                        let tag_respons = response.data
                        this.meta_tags.title = tag_respons.content ? (tag_respons.content[this.$store.state.locale].title ? tag_respons.content[this.$store.state.locale].title : meta_title_content) : meta_title_content
                        this.meta_tags.keywords = tag_respons.content ? (tag_respons.content[this.$store.state.locale].keywords ? tag_respons.content[this.$store.state.locale].keywords : meta_keywords_content) : meta_keywords_content
                        this.meta_tags.description = tag_respons.content ? (tag_respons.content[this.$store.state.locale].description ? tag_respons.content[this.$store.state.locale].description : meta_description_content) : meta_description_content
                    })
            }
        },

        head () {
            return {
                title: this.meta_tags.title ? this.meta_tags.title : this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_title : null,
                meta: [
                    { hid: 'description', name: 'description', content: this.meta_tags.description ? this.meta_tags.description : this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_description : null },
                    { hid: 'keywords', name: 'keywords', content: this.meta_tags.keywords ? this.meta_tags.keywords : this.pageInfo.headers ? this.pageInfo.headers[this.$store.state.locale].meta_keywords : null }
                ]
            }
        }
    }
</script>
