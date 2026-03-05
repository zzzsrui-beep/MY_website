<script lang="ts">
	import { fade } from 'svelte/transition';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import FormTextarea from '$lib/components/ui/FormTextarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { COLORS, SPACING, TYPOGRAPHY, DEFAULTS } from '$lib/constants';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { MESSAGES } from '$lib/messages';
	import { i18n, type LanguageCode } from '$lib/stores/i18n.svelte';

	let { data } = $props();

	let loading = $state(false);
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		setTimeout(() => {
			loading = false;
			toastStore.success(i18n.tx(MESSAGES.SUCCESS.MESSAGE_SENT));
			firstName = '';
			lastName = '';
			email = '';
			subject = '';
			message = '';
		}, 1500);
	}

	const subjects = $derived([
		{ value: 'general', label: i18n.tx('General Inquiry') },
		{ value: 'order', label: i18n.tx('Order Status') },
		{ value: 'return', label: i18n.tx('Returns & Exchanges') },
		{ value: 'collaboration', label: i18n.tx('Press & Collaboration') }
	]);

	const contactLinks = $derived([
		{ label: i18n.tx('Email'), href: `mailto:${DEFAULTS.demoEmail}`, text: DEFAULTS.demoEmail },
		{ label: i18n.tx('Press'), href: 'mailto:press@vanflow.com', text: 'press@vanflow.com' }
	]);

	const CONTACT_SERVICE_HOURS: Record<LanguageCode, string> = {
		en: 'Our client services team is available Monday through Friday, 9:00am - 5:00pm Beijing Time',
		ja: 'カスタマーサービス対応時間は、月曜日から金曜日の北京時間 9:00 - 17:00 です',
		zh: '我们的客户服务时间为周一至周五（北京时间）上午 9:00 至下午 5:00'
	};

	const CONTACT_LOCATION: Record<LanguageCode, string> = {
		en: 'Chengdu, Sichuan, China',
		ja: '中国・四川・成都',
		zh: '中国·四川·成都'
	};

	let serviceHoursText = $derived(CONTACT_SERVICE_HOURS[i18n.language] ?? CONTACT_SERVICE_HOURS.en);
	let locationText = $derived(CONTACT_LOCATION[i18n.language] ?? CONTACT_LOCATION.en);
</script>

<svelte:head>
	<title>{i18n.tx('Contact')} | {data.settings.siteName}</title>
	<meta name="description" content={`Get in touch with ${data.settings.siteName}.`} />
</svelte:head>

<div class="min-h-screen {COLORS.bg} {COLORS.text} pt-[80px]">
	<div class="{SPACING.container} py-12 md:py-24">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
			<div class="space-y-12">
				<div>
					<h1 class="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-6">{i18n.tx('Contact')}</h1>
					<p class="{TYPOGRAPHY.body} opacity-80 max-w-sm">
						{serviceHoursText}
					</p>
				</div>

				<div class="space-y-8">
					{#each contactLinks as contact (contact.label)}
						<div>
							<span class="{TYPOGRAPHY.label} opacity-40 block mb-2">{contact.label}</span>
							<a
								href={contact.href}
								class="text-lg md:text-xl font-display uppercase tracking-wider border-b border-primary/20 dark:border-white/20 hover:border-primary dark:hover:border-white transition-colors"
							>
								{contact.text}
							</a>
						</div>
					{/each}

					<div>
						<span class="{TYPOGRAPHY.label} opacity-40 block mb-2">{i18n.tx('Location')}</span>
						<p class="{TYPOGRAPHY.body} opacity-80">
							{locationText}
						</p>
					</div>
				</div>
			</div>

			<div
				class="bg-white dark:bg-zinc-900 border border-primary/5 dark:border-white/5 p-8 md:p-12 shadow-sm"
				in:fade={{ duration: 600, delay: 200 }}
			>
				<form onsubmit={handleSubmit} class="space-y-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormInput id="firstName" label={i18n.tx('First Name')} bind:value={firstName} required />
						<FormInput id="lastName" label={i18n.tx('Last Name')} bind:value={lastName} required />
					</div>

					<FormInput id="email" type="email" label={i18n.tx('Email Address')} bind:value={email} required />

					<FormSelect
						id="subject"
						label={i18n.tx('Subject')}
						options={subjects}
						bind:value={subject}
						required
					/>

					<FormTextarea id="message" label={i18n.tx('Message')} bind:value={message} required rows={4} />

					<div class="pt-4">
						<Button type="submit" fullWidth disabled={loading}>
							{loading ? i18n.tx('Sending...') : i18n.tx('Send Message')}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
