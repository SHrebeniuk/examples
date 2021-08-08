<template>
  <div class="flex flex-col page-title">
    <h2 class="mb-2">
      {{ title }}
    </h2>
    <p>{{ subtitle }}</p>
  </div>
</template>
<script>
export default {
	props: {
		title: {
			default: 'Default Page title',
			type: String,
		},
		subtitle: {
			default: 'Default Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
			type: String,
		},
	},
};
</script>
