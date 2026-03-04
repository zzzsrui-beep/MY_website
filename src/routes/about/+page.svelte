<script lang="ts">
	import { i18n, type LanguageCode } from '$lib/stores/i18n.svelte';

	let { data } = $props();

	type AboutCopy = {
		pageTitle: string;
		metaDescription: string;
		sections: Array<{ title: string; paragraphs: string[] }>;
		overviewTitle: string;
		companyOverview: string[];
		contactPrefix: string;
	};

	const ABOUT_COPY: Record<LanguageCode, AboutCopy> = {
		en: {
			pageTitle: 'PandaShop About Us',
			metaDescription:
				'Learn PandaShop\'s brand story and company profile from Sichuan, China, and discover the warmth of authentic panda culture products.',
			sections: [
				{
					title: '[Brand Slogan]',
					paragraphs: [
						'From the hometown of giant pandas, we bring a touch of healing to your everyday life.'
					]
				},
				{
					title: '[Brand Story]',
					paragraphs: [
						'Nice to meet you, we are PandaShop.',
						'We are a creative brand born in Sichuan, China, the hometown of giant pandas. In today\'s busy and sometimes monotonous life, how long has it been since you truly smiled from the heart?',
						'We have always believed that giant pandas, with their round bodies and adorable expressions, carry a magical power to instantly ease people\'s minds and bring pure healing.',
						'That is why we carefully curate high-quality panda-themed products from China. We are not only selling products, we are sharing authentic and lovable panda culture with panda lovers around the world.'
					]
				},
				{
					title: '[Our Commitment]',
					paragraphs: [
						'Commitment and quality rooted in the place of origin.',
						'Because we are based in the hometown of giant pandas, we are able to offer creative products that are genuinely high-quality and full of warmth. We reject low-quality mass production and insist on combining practicality with cuteness.',
						'To us, these are more than daily items. They are cultural bridges that deliver joy. We hope that when you hold these products in your hands, you can truly feel a smile and healing that crosses borders.'
					]
				}
			],
			overviewTitle: '[Company Overview]',
			companyOverview: [
				'Company Name: PandaShop (to be replaced with the officially registered legal name in the future)',
				'Headquarters: Sichuan Province, China',
				'Core Business: Planning, design, and sales of original panda-themed cultural and creative products, lifestyle goods, and related merchandise'
			],
			contactPrefix: 'Contact Us:'
		},
		ja: {
			pageTitle: 'PandaShop\u306b\u3064\u3044\u3066',
			metaDescription:
				'\u4e2d\u56fd\u56db\u5ddd\u751f\u307e\u308c\u306e PandaShop \u306e\u30d6\u30e9\u30f3\u30c9\u30b9\u30c8\u30fc\u30ea\u30fc\u3068\u4f1a\u793e\u60c5\u5831\u3002\u672c\u683c\u7684\u306a\u30d1\u30f3\u30c0\u6587\u5316\u30a2\u30a4\u30c6\u30e0\u3092\u5c4a\u3051\u307e\u3059\u3002',
			sections: [
				{
					title: '\u3010\u30d6\u30e9\u30f3\u30c9\u30b9\u30ed\u30fc\u30ac\u30f3\u3011',
					paragraphs: [
						'\u30b8\u30e3\u30a4\u30a2\u30f3\u30c8\u30d1\u30f3\u30c0\u306e\u6545\u90f7\u304b\u3089\u3001\u307f\u306a\u3055\u3093\u306e\u6bce\u65e5\u306b\u201c\u7652\u3057\u201d\u3092\u5c4a\u3051\u307e\u3059\u3002'
					]
				},
				{
					title: '\u3010\u30d6\u30e9\u30f3\u30c9\u30b9\u30c8\u30fc\u30ea\u30fc\u3011',
					paragraphs: [
						'\u306f\u3058\u3081\u307e\u3057\u3066\u3001\u79c1\u305f\u3061\u306f PandaShop \u3067\u3059\u3002',
						'\u79c1\u305f\u3061\u306f\u3001\u30b8\u30e3\u30a4\u30a2\u30f3\u30c8\u30d1\u30f3\u30c0\u306e\u6545\u90f7\u3067\u3042\u308b\u4e2d\u56fd\u30fb\u56db\u5ddd\u3067\u751f\u307e\u308c\u305f\u30af\u30ea\u30a8\u30a4\u30c6\u30a3\u30d6\u30d6\u30e9\u30f3\u30c9\u3067\u3059\u3002\u5fd9\u3057\u304f\u3001\u3068\u304d\u306b\u5358\u8abf\u306b\u306a\u308a\u304c\u3061\u306a\u73fe\u4ee3\u751f\u6d3b\u306e\u4e2d\u3067\u3001\u5fc3\u304b\u3089\u7b11\u9854\u306b\u306a\u3063\u305f\u306e\u306f\u3044\u3064\u3076\u308a\u3067\u3057\u3087\u3046\u304b\u3002',
						'\u307e\u308b\u307e\u308b\u3068\u3057\u305f\u4f53\u3068\u611b\u304f\u308b\u3057\u3044\u8868\u60c5\u306e\u30d1\u30f3\u30c0\u306b\u306f\u3001\u4eba\u306e\u5fc3\u3092\u307b\u3069\u304d\u3001\u7d14\u7c8b\u306a\u7652\u3057\u3092\u3082\u305f\u3089\u3059\u4e0d\u601d\u8b70\u306a\u529b\u304c\u3042\u308b\u3068\u3001\u79c1\u305f\u3061\u306f\u4fe1\u3058\u3066\u3044\u307e\u3059\u3002',
						'\u3060\u304b\u3089\u3053\u305d\u3001\u79c1\u305f\u3061\u306f\u4e2d\u56fd\u56fd\u5185\u306e\u9ad8\u54c1\u8cea\u306a\u30d1\u30f3\u30c0\u95a2\u9023\u30a2\u30a4\u30c6\u30e0\u3092\u53b3\u9078\u3057\u3066\u5c4a\u3051\u3066\u3044\u307e\u3059\u3002\u79c1\u305f\u3061\u306f\u5546\u54c1\u3092\u8ca9\u58f2\u3059\u308b\u3060\u3051\u3067\u306a\u304f\u3001\u7d14\u6b63\u3067\u611b\u3055\u308c\u308b\u30d1\u30f3\u30c0\u6587\u5316\u3092\u4e16\u754c\u4e2d\u306e\u30d5\u30a1\u30f3\u306b\u5c4a\u3051\u305f\u3044\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002'
					]
				},
				{
					title: '\u3010\u79c1\u305f\u3061\u306e\u3053\u3060\u308f\u308a\u3011',
					paragraphs: [
						'\u7523\u5730\u306b\u6839\u3056\u3057\u305f\u3053\u3060\u308f\u308a\u3068\u54c1\u8cea\u3002',
						'\u30d1\u30f3\u30c0\u306e\u6545\u90f7\u306b\u62e0\u70b9\u3092\u7f6e\u304f\u79c1\u305f\u3061\u3060\u304b\u3089\u3053\u305d\u3001\u6e29\u304b\u307f\u3068\u54c1\u8cea\u3092\u517c\u306d\u5099\u3048\u305f\u30af\u30ea\u30a8\u30a4\u30c6\u30a3\u30d6\u30a2\u30a4\u30c6\u30e0\u3092\u5c4a\u3051\u3089\u308c\u307e\u3059\u3002\u79c1\u305f\u3061\u306f\u7c97\u96d1\u306a\u5927\u91cf\u751f\u7523\u3092\u62d2\u307f\u3001\u5b9f\u7528\u6027\u3068\u53ef\u611b\u3055\u306e\u4e21\u7acb\u3092\u8ffd\u6c42\u3057\u307e\u3059\u3002',
						'\u79c1\u305f\u3061\u306b\u3068\u3063\u3066\u3053\u308c\u3089\u306f\u5358\u306a\u308b\u65e5\u7528\u54c1\u3067\u306f\u306a\u304f\u3001\u5e78\u305b\u3092\u5c4a\u3051\u308b\u6587\u5316\u306e\u67b6\u3051\u6a4b\u3067\u3059\u3002\u624b\u306b\u53d6\u3063\u305f\u3068\u304d\u3001\u56fd\u5883\u3092\u8d8a\u3048\u305f\u7b11\u9854\u3068\u7652\u3057\u3092\u611f\u3058\u3066\u3082\u3089\u3048\u308b\u3053\u3068\u3092\u9858\u3063\u3066\u3044\u307e\u3059\u3002'
					]
				}
			],
			overviewTitle: '\u3010\u4f1a\u793e\u6982\u8981\u3011',
			companyOverview: [
				'\u4f1a\u793e\u540d\uff1aPandaShop\uff08\u5c06\u6765\u306e\u6b63\u5f0f\u767b\u8a18\u793e\u540d\u3092\u8a18\u8f09\uff09',
				'\u672c\u793e\u6240\u5728\u5730\uff1a\u4e2d\u56fd\u30fb\u56db\u5ddd\u7701',
				'\u4e3b\u8981\u4e8b\u696d\uff1a\u30d1\u30f3\u30c0\u30c6\u30fc\u30de\u306e\u30aa\u30ea\u30b8\u30ca\u30eb\u6587\u5275\u5546\u54c1\u3001\u751f\u6d3b\u96d1\u8ca8\u306a\u3069\u306e\u4f01\u753b\u30fb\u30c7\u30b6\u30a4\u30f3\u30fb\u8ca9\u58f2'
			],
			contactPrefix: '\u304a\u554f\u3044\u5408\u308f\u305b\uff1a'
		},
		zh: {
			pageTitle: 'PandaShop \u5173\u4e8e\u6211\u4eec',
			metaDescription:
				'\u6765\u81ea\u4e2d\u56fd\u56db\u5ddd\u7684 PandaShop \u54c1\u724c\u6545\u4e8b\u4e0e\u516c\u53f8\u4ecb\u7ecd\uff0c\u5206\u4eab\u6700\u7eaf\u6b63\u3001\u6700\u6cbb\u6108\u7684\u718a\u732b\u6587\u5316\u521b\u610f\u4ea7\u54c1\u3002',
			sections: [
				{
					title: '\u3010\u54c1\u724c\u6807\u8bed\u3011',
					paragraphs: [
						'\u6765\u81ea\u5927\u718a\u732b\u7684\u6545\u4e61\uff0c\u4e3a\u4f60\u7684\u65e5\u5e38\u6ce8\u5165\u4e00\u4efd\u201c\u6cbb\u6108\u201d\u3002'
					]
				},
				{
					title: '\u3010\u54c1\u724c\u6545\u4e8b\u3011',
					paragraphs: [
						'\u521d\u6b21\u89c1\u9762\uff0c\u6211\u4eec\u662f PandaShop\u3002',
						'\u6211\u4eec\u662f\u4e00\u5bb6\u8bde\u751f\u4e8e\u5927\u718a\u732b\u6545\u4e61\u2014\u2014\u4e2d\u56fd\u56db\u5ddd\u7684\u521b\u610f\u54c1\u724c\u3002\u5728\u73b0\u4ee3\u4eba\u5fd9\u788c\u3001\u6709\u65f6\u751a\u81f3\u611f\u5230\u67af\u71e5\u7684\u751f\u6d3b\u4e2d\uff0c\u4f60\u6709\u591a\u4e45\u6ca1\u6709\u53d1\u81ea\u5185\u5fc3\u5730\u5fae\u7b11\u4e86\uff1f',
						'\u6211\u4eec\u59cb\u7ec8\u76f8\u4fe1\uff0c\u5706\u6eda\u6eda\u3001\u61a8\u6001\u53ef\u63ac\u7684\u5927\u718a\u732b\u4eec\uff0c\u5929\u751f\u62e5\u6709\u4e00\u79cd\u4e0d\u53ef\u601d\u8bae\u7684\u9b54\u6cd5\uff0c\u80fd\u591f\u77ac\u95f4\u89e3\u5f00\u4eba\u4eec\u7684\u5fc3\u7ed3\uff0c\u5e26\u6765\u6700\u7eaf\u7cb9\u7684\u6cbb\u6108\u611f\u3002',
						'\u6b63\u56e0\u5982\u6b64\uff0c\u6211\u4eec\u7528\u5fc3\u6253\u78e8\u3001\u4e25\u9009\u6765\u81ea\u4e2d\u56fd\u672c\u571f\u7684\u4f18\u8d28\u718a\u732b\u5468\u8fb9\u3002\u6211\u4eec\u4e0d\u4ec5\u662f\u5728\u552e\u5356\u5546\u54c1\uff0c\u66f4\u662f\u5e0c\u671b\u5c06\u8fd9\u4efd\u6700\u7eaf\u6b63\u3001\u6700\u53ef\u7231\u7684\u718a\u732b\u6587\u5316\uff0c\u9001\u5230\u5168\u4e16\u754c\u6bcf\u4e00\u4f4d\u559c\u7231\u718a\u732b\u7684\u670b\u53cb\u624b\u4e2d\u3002'
					]
				},
				{
					title: '\u3010\u6211\u4eec\u7684\u575a\u6301\u3011',
					paragraphs: [
						'\u6e90\u81ea\u539f\u4ea7\u5730\u7684\u575a\u6301\u4e0e\u54c1\u8d28',
						'\u6b63\u56e0\u4e3a\u6211\u4eec\u624e\u6839\u4e8e\u5927\u718a\u732b\u7684\u6545\u4e61\uff0c\u624d\u80fd\u4e3a\u4f60\u5e26\u6765\u771f\u6b63\u9ad8\u54c1\u8d28\u3001\u5bcc\u6709\u6e29\u5ea6\u7684\u521b\u610f\u4ea7\u54c1\u3002\u6211\u4eec\u62d2\u7edd\u7c97\u5236\u6ee5\u9020\uff0c\u575a\u6301\u5c06\u5b9e\u7528\u6027\u4e0e\u53ef\u7231\u611f\u5b8c\u7f8e\u7ed3\u5408\u3002',
						'\u5bf9\u6211\u4eec\u6765\u8bf4\uff0c\u8fd9\u4e9b\u4e0d\u4ec5\u4ec5\u662f\u65e5\u5e38\u4f7f\u7528\u7684\u751f\u6d3b\u7269\u4ef6\uff0c\u66f4\u662f\u4f20\u9012\u5feb\u4e50\u7684\u6587\u5316\u6865\u6881\u3002\u6211\u4eec\u5e0c\u671b\u5f53\u4f60\u5c06\u8fd9\u4e9b\u5c0f\u7269\u4ef6\u6367\u5728\u624b\u5fc3\u65f6\uff0c\u80fd\u5207\u5b9e\u611f\u53d7\u5230\u90a3\u4efd\u8de8\u8d8a\u56fd\u754c\u7684\u5fae\u7b11\u548c\u6cbb\u6108\u3002'
					]
				}
			],
			overviewTitle: '\u3010\u516c\u53f8\u6982\u8981\u3011',
			companyOverview: [
				'\u516c\u53f8\u540d\u79f0\uff1aPandaShop\uff08\u8bf7\u586b\u5165\u672a\u6765\u5b9e\u9645\u6ce8\u518c\u7684\u516c\u53f8\u540d\uff09',
				'\u603b\u90e8\u6240\u5728\u5730\uff1a\u4e2d\u56fd \u00b7 \u56db\u5ddd\u7701',
				'\u4e3b\u8425\u4e1a\u52a1\uff1a\u718a\u732b\u4e3b\u9898\u539f\u521b\u6587\u521b\u3001\u6742\u8d27\u7b49\u521b\u610f\u4ea7\u54c1\u7684\u4f01\u5212\u3001\u8bbe\u8ba1\u4e0e\u9500\u552e'
			],
			contactPrefix: '\u8054\u7cfb\u6211\u4eec\uff1a'
		}
	};

	const copy = $derived(ABOUT_COPY[i18n.language] ?? ABOUT_COPY.en);
</script>

<svelte:head>
	<title>{copy.pageTitle} | {data.settings.siteName}</title>
	<meta name="description" content={copy.metaDescription} />
</svelte:head>

<div class="min-h-screen bg-background-light dark:bg-background-dark text-primary dark:text-white pt-[80px]">
	<div class="max-w-[980px] mx-auto px-6 md:px-12 py-12 md:py-20">
		<h1 class="text-4xl md:text-6xl font-display tracking-tight mb-10">{copy.pageTitle}</h1>

		{#each copy.sections as section (section.title)}
			<section class="space-y-5 mb-10">
				<h2 class="text-xl md:text-2xl font-display tracking-wide">{section.title}</h2>
				{#each section.paragraphs as paragraph (paragraph)}
					<p class="text-base md:text-lg leading-relaxed opacity-90">{paragraph}</p>
				{/each}
			</section>
		{/each}

		<section class="space-y-4 border-t border-primary/15 dark:border-white/15 pt-8">
			<h2 class="text-xl md:text-2xl font-display tracking-wide">{copy.overviewTitle}</h2>
			{#each copy.companyOverview as line (line)}
				<p class="text-base md:text-lg leading-relaxed opacity-90">{line}</p>
			{/each}
			<p class="text-base md:text-lg leading-relaxed opacity-90">
				{copy.contactPrefix}
				<a href="mailto:support@yourdomain.com" class="underline underline-offset-4 hover:opacity-70">
					support@yourdomain.com
				</a>
			</p>
		</section>
	</div>
</div>
