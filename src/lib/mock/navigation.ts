import type { NavItem } from '$lib/types';

export const frontendHeaderNav: NavItem[] = [
	{
		id: 'nav-collection',
		label: 'Collection',
		url: '/collection',
		location: 'header',
		order: 1,
		isVisible: true
	},
	{ id: 'nav-shop', label: 'Shop', url: '/shop', location: 'header', order: 2, isVisible: true },
	{
		id: 'nav-about',
		label: 'About',
		url: '/about',
		location: 'header',
		order: 3,
		isVisible: true
	},
	{
		id: 'nav-contact',
		label: 'Contact',
		url: '/contact',
		location: 'header',
		order: 4,
		isVisible: true
	}
];

export const frontendFooterNav: NavItem[] = [
	{ id: 'footer-shop', label: 'Shop', url: '/shop', location: 'footer', order: 1, isVisible: true },
	{
		id: 'footer-collection',
		label: 'Collection',
		url: '/collection',
		location: 'footer',
		order: 2,
		isVisible: true
	},
	{
		id: 'footer-contact',
		label: 'Contact',
		url: '/contact',
		location: 'footer',
		order: 3,
		isVisible: true
	}
];

export function getNavCategorySlugs() {
	const categorySlugs = frontendHeaderNav
		.filter((item) => item.url.includes('category='))
		.map((item) => item.url.match(/category=([^&]+)/)?.[1])
		.filter((value): value is string => Boolean(value));

	const genderSlugs = frontendHeaderNav
		.filter((item) => item.url.includes('gender='))
		.map((item) => item.url.match(/gender=([^&]+)/)?.[1])
		.filter((value): value is string => Boolean(value));

	return [...new Set([...categorySlugs, ...genderSlugs])];
}
