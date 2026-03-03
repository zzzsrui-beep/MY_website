// Design System Constants
// Centralized design tokens for consistent styling across the app

// =============================================================================
// TYPOGRAPHY - 文字样式
// =============================================================================
export const TYPOGRAPHY = {
	// Labels (小型大写标签)
	label: 'text-[10px] font-bold uppercase tracking-[0.2em]',
	labelSm: 'text-[10px] uppercase tracking-[0.15em]',
	labelLg: 'text-xs font-bold uppercase tracking-widest',
	labelAction: 'text-[10px] uppercase tracking-widest hover:underline cursor-pointer',

	// Body text
	body: 'text-sm tracking-wider leading-relaxed',
	bodySm: 'text-[10px] leading-relaxed tracking-[0.1em]',

	// Headings
	heading: 'font-display font-medium uppercase tracking-wide',
	headingLg: 'font-display font-medium uppercase tracking-[0.05em]',
	headingXl: 'text-3xl font-display uppercase tracking-widest',
	headingPage: 'text-3xl font-display font-bold uppercase tracking-widest',

	// Links
	link: 'hover:underline underline-offset-4 decoration-1 transition-colors'
} as const;

// =============================================================================
// COLORS - 颜色主题类 (减少重复书写)
// =============================================================================
export const COLORS = {
	// 主色文字 (使用最多)
	text: 'text-primary dark:text-white',
	textMuted: 'text-primary/60 dark:text-white/60',
	textSubtle: 'text-primary/40 dark:text-white/40',

	// 背景
	bg: 'bg-background-light dark:bg-background-dark',
	bgAlt: 'bg-white dark:bg-zinc-900',

	// 边框
	border: 'border-primary dark:border-white',
	borderMuted: 'border-primary/10 dark:border-white/10'
} as const;

// =============================================================================
// BUTTONS - 按钮样式 (用于无法使用 Button 组件的场景)
// =============================================================================
export const BUTTON_STYLES = {
	// 轮廓按钮 (最常用)
	outline:
		'border border-primary dark:border-white text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300',

	// 实心按钮
	solid:
		'bg-primary text-white dark:bg-white dark:text-primary hover:opacity-90 transition-opacity',

	// 按钮基础类
	base: 'font-bold uppercase tracking-widest cursor-pointer inline-flex items-center justify-center',

	// 尺寸
	sizeSm: 'h-10 px-4 text-[10px] tracking-[0.15em]',
	sizeMd: 'h-12 px-6 text-[10px] tracking-[0.2em]',
	sizeLg: 'h-14 px-10 text-xs tracking-widest'
} as const;

// =============================================================================
// TRANSITIONS - 过渡动画
// =============================================================================
export const TRANSITIONS = {
	colors: 'transition-colors duration-300',
	// GPU-friendly: use specific properties instead of 'all'
	// For combined effects, compose multiple classes
	colorsAndOpacity: 'transition-[color,background-color,border-color,opacity] duration-300',
	opacity: 'transition-opacity duration-300',
	transform: 'transition-transform duration-300',
	// For scale + opacity effects (common hover pattern)
	transformAndOpacity: 'transition-[transform,opacity] duration-300'
} as const;

// =============================================================================
// Z-INDEX - 层级系统 (与 app.css @theme 匹配)
// =============================================================================
export const Z_INDEX = {
	base: 'z-[var(--z-base)]',
	content: 'z-[var(--z-content)]',
	overlayContent: 'z-[var(--z-overlay-content)]',
	sticky: 'z-[var(--z-sticky)]',
	header: 'z-[var(--z-header)]',
	modalBackdrop: 'z-[var(--z-modal-backdrop)]',
	modal: 'z-[var(--z-modal)]',
	toast: 'z-[var(--z-toast)]',
	max: 'z-[var(--z-max)]'
} as const;

// =============================================================================
// SPACING - 间距常量
// =============================================================================
export const SPACING = {
	container: 'max-w-[1600px] mx-auto px-6 md:px-12',
	section: 'py-24 px-6 md:px-12'
} as const;

// =============================================================================
// LAYOUT - 常用布局模式
// =============================================================================
export const LAYOUT = {
	// Page layouts
	pageContainer:
		'min-h-screen bg-background-light dark:bg-background-dark pt-[var(--content-offset)]',
	contentWrapper: 'max-w-[1200px] mx-auto px-6 md:px-12 py-12',

	// Loading states
	loadingCenter: 'flex items-center justify-center py-24',
	loadingText: 'animate-pulse text-primary/60 dark:text-white/60',

	// Empty states
	emptyState: 'text-center py-24 border border-primary/10 dark:border-white/10'
} as const;

// =============================================================================
// DEFAULTS - 默认值 (当 CMS 设置不可用时的 Fallback)
// 实际业务配置应通过 data.settings 从 CMS 获取
// =============================================================================
export const DEFAULTS = {
	siteName: 'PANDA CREATIVE',
	currencySymbol: '$',
	currencyCode: 'USD',
	freeShippingThreshold: 300,
	demoEmail: 'demo@pandacreative.com'
} as const;

// =============================================================================
// CONTENT IMAGES - 统一的图片 Fallback (实际由 CMS assets/settings 管理)
// =============================================================================
export const CONTENT_IMAGES = {
	// 空状态图片
	WISHLIST_EMPTY:
		'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=2000&auto=format&fit=crop',
	CART_EMPTY:
		'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=2000&auto=format&fit=crop',

	// About 页面
	ABOUT_HERO:
		'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2000&auto=format&fit=crop',
	ABOUT_SECTION:
		'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2000&auto=format&fit=crop',

	// 首页
	HOME_HERO:
		'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2000&auto=format&fit=crop',
	HOME_STORY:
		'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2000&auto=format&fit=crop',

	// SEO / Open Graph
	OG_DEFAULT:
		'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200&auto=format&fit=crop'
} as const;

// =============================================================================
// STORAGE KEYS - LocalStorage 键名
// =============================================================================
export const STORAGE_KEYS = {
	CART: 'vanflow_cart',
	WISHLIST: 'vanflow_wishlist'
	// Note: Auth state is handled by frontend store in shell mode
} as const;
