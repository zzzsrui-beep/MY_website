<script lang="ts">
	import SectionRenderer from '$lib/components/SectionRenderer.svelte';
	import Metadata from '$lib/components/seo/Metadata.svelte';
	import { i18n } from '$lib/stores/i18n.svelte';

	let { data } = $props();

	let sortedSections = $derived(
		[...data.sections].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
	);

	let heroSection = $derived(data.sections.find((s) => s.type === 'hero'));

	let metaTitle = $derived(i18n.tx(data.page?.title || heroSection?.heading || data.settings.siteName));
	let metaDesc = $derived(i18n.tx(data.page?.metaDescription || heroSection?.subheading || ''));
	let metaImage = $derived(data.page?.ogImage || heroSection?.imageUrl || '');
</script>

<Metadata
	title={metaTitle}
	description={metaDesc}
	image={metaImage}
	siteName={data.settings.siteName}
/>

{#each sortedSections as section (section.id)}
	<SectionRenderer
		{section}
		categories={data.categories}
		featuredProducts={data.featuredProducts}
		homeAssets={data.homeAssets}
	/>
{/each}
