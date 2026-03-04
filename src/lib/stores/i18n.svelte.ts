import { browser } from '$app/environment';

export type LanguageCode = 'en' | 'ja' | 'zh';

const LANGUAGE_STORAGE_KEY = 'site-language';

export const LANGUAGE_OPTIONS = [
	{ code: 'en' as const, shortLabel: 'EN', menuLabel: '\u82f1\u6587' },
	{ code: 'ja' as const, shortLabel: 'JP', menuLabel: '\u65e5\u6587' },
	{ code: 'zh' as const, shortLabel: '\u4e2d', menuLabel: '\u4e2d\u6587' }
];

const TRANSLATIONS: Record<Exclude<LanguageCode, 'en'>, Record<string, string>> = {
	ja: {
		Collection: '\u30b3\u30ec\u30af\u30b7\u30e7\u30f3',
		Shop: '\u30b7\u30e7\u30c3\u30d7',
		Contact: '\u304a\u554f\u3044\u5408\u308f\u305b',
		About: '\u79c1\u305f\u3061\u306b\u3064\u3044\u3066',
		Wishlist: '\u30a6\u30a3\u30c3\u30b7\u30e5\u30ea\u30b9\u30c8',
		SEARCH: '\u691c\u7d22',
		Search: '\u691c\u7d22',
		Account: '\u30a2\u30ab\u30a6\u30f3\u30c8',
		BAG: '\u30d0\u30c3\u30b0',
		Bag: '\u30d0\u30c3\u30b0',
		Language: '\u8a00\u8a9e',
		Close: '\u9589\u3058\u308b',
		'Skip to Content': '\u30b3\u30f3\u30c6\u30f3\u30c4\u3078\u30b9\u30ad\u30c3\u30d7',
		'Join the Conversation': '\u6700\u65b0\u60c5\u5831\u3092\u53d7\u3051\u53d6\u308b',
		'Email Address': '\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9',
		'COOKIE SETTINGS': 'Cookie\u8a2d\u5b9a',
		'Cookies.': '\u30af\u30c3\u30ad\u30fc',
		'Essential Only': '\u5fc5\u9808\u306e\u307f',
		Accept: '\u540c\u610f\u3059\u308b',
		'Shopping Bag': '\u30b7\u30e7\u30c3\u30d4\u30f3\u30b0\u30d0\u30c3\u30b0',
		'Your bag is empty': '\u30d0\u30c3\u30b0\u306f\u7a7a\u3067\u3059',
		'Continue Shopping': '\u8cb7\u3044\u7269\u3092\u7d9a\u3051\u308b',
		Remove: '\u524a\u9664',
		Subtotal: '\u5c0f\u8a08',
		Checkout: '\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8',
		'You have Free Shipping': '\u9001\u6599\u7121\u6599\u304c\u9069\u7528\u3055\u308c\u3066\u3044\u307e\u3059',
		Spend: '\u3042\u3068',
		'more for Free Shipping': '\u3067\u9001\u6599\u7121\u6599',
		Filter: '\u30d5\u30a3\u30eb\u30bf\u30fc',
		Clear: '\u30af\u30ea\u30a2',
		Apply: '\u9069\u7528',
		'No products found in this category': '\u3053\u306e\u30ab\u30c6\u30b4\u30ea\u306e\u5546\u54c1\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093',
		'View More Products': '\u3082\u3063\u3068\u898b\u308b',
		'Order Summary': '\u6ce8\u6587\u6982\u8981',
		'Your cart is empty.': '\u30ab\u30fc\u30c8\u306f\u7a7a\u3067\u3059',
		Total: '\u5408\u8a08',
		'Place Demo Order': '\u30c7\u30e2\u6ce8\u6587\u3092\u78ba\u5b9a',
		'Thank You For Your Order': '\u3054\u6ce8\u6587\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059',
		'View My Account': '\u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u898b\u308b',
		'Questions? Email us at': '\u3054\u4e0d\u660e\u70b9\u306f\u30e1\u30fc\u30eb\u3067\u304a\u554f\u3044\u5408\u308f\u305b\u304f\u3060\u3055\u3044',
		Location: '\u6240\u5728\u5730',
		'First Name': '\u540d',
		'Last Name': '\u59d3',
		Subject: '\u4ef6\u540d',
		Message: '\u30e1\u30c3\u30bb\u30fc\u30b8',
		'Sending...': '\u9001\u4fe1\u4e2d...',
		'Send Message': '\u9001\u4fe1\u3059\u308b',
		'General Inquiry': '\u4e00\u822c\u304a\u554f\u3044\u5408\u308f\u305b',
		'Order Status': '\u6ce8\u6587\u72b6\u6cc1',
		'Returns & Exchanges': '\u8fd4\u54c1\u30fb\u4ea4\u63db',
		'Press & Collaboration': '\u30d7\u30ec\u30b9\u30fb\u30b3\u30e9\u30dc',
		Orders: '\u6ce8\u6587',
		Addresses: '\u4f4f\u6240',
		Status: '\u30b9\u30c6\u30fc\u30bf\u30b9',
		'Demo Signed In': '\u30c7\u30e2\u30ed\u30b0\u30a4\u30f3\u4e2d',
		'Guest Session': '\u30b2\u30b9\u30c8\u30bb\u30c3\u30b7\u30e7\u30f3',
		'Address Book': '\u4f4f\u6240\u9332',
		Back: '\u623b\u308b',
		Home: '\u81ea\u5b85',
		'Order History': '\u6ce8\u6587\u5c65\u6b74',
		'Back to Dashboard': '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306b\u623b\u308b',
		Order: '\u6ce8\u6587',
		'No orders yet': '\u307e\u3060\u6ce8\u6587\u304c\u3042\u308a\u307e\u305b\u3093',
		'Start Shopping': '\u30b7\u30e7\u30c3\u30d4\u30f3\u30b0\u3092\u59cb\u3081\u308b',
		'Back to History': '\u5c65\u6b74\u306b\u623b\u308b',
		'Purchase Details': '\u8cfc\u5165\u660e\u7d30',
		'No Img': '\u753b\u50cf\u306a\u3057',
		'Tax & Shipping': '\u7a0e\u91d1\u30fb\u9001\u6599',
		Discounts: '\u5272\u5f15',
		'Placed on': '\u6ce8\u6587\u65e5',
		Unknown: '\u4e0d\u660e',
		'Shipping Address': '\u914d\u9001\u5148\u4f4f\u6240',
		Tracking: '\u8ffd\u8de1',
		'Unknown Date': '\u65e5\u4ed8\u4e0d\u660e',
		more: '\u70b9',
		View: '\u8868\u793a',
		'My Collection': '\u30de\u30a4\u30b3\u30ec\u30af\u30b7\u30e7\u30f3',
		'The canvas is empty': '\u307e\u3060\u4fdd\u5b58\u3055\u308c\u305f\u5546\u54c1\u306f\u3042\u308a\u307e\u305b\u3093',
		'Start Curating': '\u5546\u54c1\u3092\u63a2\u3059',
		'Quick Add': '\u3059\u3050\u306b\u8ffd\u52a0',
		'Remove from wishlist': '\u30a6\u30a3\u30c3\u30b7\u30e5\u30ea\u30b9\u30c8\u304b\u3089\u524a\u9664',
		'Add to wishlist': '\u30a6\u30a3\u30c3\u30b7\u30e5\u30ea\u30b9\u30c8\u306b\u8ffd\u52a0',
		'In Stock': '\u5728\u5eab\u3042\u308a',
		'Move to Bag': '\u30d0\u30c3\u30b0\u306b\u79fb\u52d5',
		'Page Not Found': '\u30da\u30fc\u30b8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093',
		'Something Went Wrong': '\u554f\u984c\u304c\u767a\u751f\u3057\u307e\u3057\u305f',
		'Return Home': '\u30db\u30fc\u30e0\u3078\u623b\u308b',
		'System Status': '\u30b7\u30b9\u30c6\u30e0\u72b6\u614b',
		'Currently Under Maintenance': '\u73fe\u5728\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9\u4e2d',
		Maintenance: '\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9',
		Error: '\u30a8\u30e9\u30fc',
		'An unexpected error occurred.': '\u4e88\u671f\u3057\u306a\u3044\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f',
		'Size Guide': '\u30b5\u30a4\u30ba\u30ac\u30a4\u30c9',
		'ADD TO BAG': '\u30d0\u30c3\u30b0\u306b\u8ffd\u52a0',
		'Material & Care': '\u7d20\u6750\u3068\u304a\u624b\u5165\u308c',
		'Shipping & Returns': '\u914d\u9001\u3068\u8fd4\u54c1',
		'You May Also Like': '\u3042\u306a\u305f\u3078\u306e\u304a\u3059\u3059\u3081',
		'No products to display': '\u8868\u793a\u3067\u304d\u308b\u5546\u54c1\u304c\u3042\u308a\u307e\u305b\u3093',
		'Featured Products': '\u6ce8\u76ee\u5546\u54c1',
		'View All': '\u3059\u3079\u3066\u8868\u793a',
		'Shop Now': '\u4eca\u3059\u3050\u8cfc\u5165',
		Story: '\u30b9\u30c8\u30fc\u30ea\u30fc',
		'SEARCH RESULTS': '\u691c\u7d22\u7d50\u679c',
		PILLAR: '\u30b7\u30ea\u30fc\u30ba',
		'PRODUCT TYPE': '\u5546\u54c1\u30bf\u30a4\u30d7',
		SIZES: '\u30b5\u30a4\u30ba',
		COLOR: '\u30ab\u30e9\u30fc',
		ALL: '\u3059\u3079\u3066',
		PLUSHIES: '\u306c\u3044\u3050\u308b\u307f',
		STATIONERY: '\u6587\u5177',
		LIFESTYLE: '\u30e9\u30a4\u30d5\u30b9\u30bf\u30a4\u30eb',
		'Shop All Pandas': '\u3059\u3079\u3066\u306e\u30d1\u30f3\u30c0\u5546\u54c1',
		'Find your new friend': '\u65b0\u3057\u3044\u304a\u6c17\u306b\u5165\u308a\u3092\u898b\u3064\u3051\u3088\u3046',
		'See Collection': '\u30b3\u30ec\u30af\u30b7\u30e7\u30f3\u3092\u898b\u308b',
		'Shop Plushies': '\u306c\u3044\u3050\u308b\u307f\u3092\u898b\u308b',
		'Shop Stationery': '\u6587\u5177\u3092\u898b\u308b',
		'Shop Plushies > New Arrivals': '\u306c\u3044\u3050\u308b\u307f\u3092\u898b\u308b > \u65b0\u7740',
		'Plush Toys > New Arrivals': '\u306c\u3044\u3050\u308b\u307f > \u65b0\u7740',
		'Welcome to the Bamboo Forest': '\u7af9\u306e\u68ee\u3078\u3088\u3046\u3053\u305d',
		'Our Collections': '\u30b3\u30ec\u30af\u30b7\u30e7\u30f3\u4e00\u89a7',
		'Panda Favorites': '\u30d1\u30f3\u30c0\u4eba\u6c17\u5546\u54c1',
		'Most Loved': '\u4eba\u6c17\u30a2\u30a4\u30c6\u30e0',
		'Designed For Joy': '\u559c\u3073\u306e\u305f\u3081\u306e\u30c7\u30b6\u30a4\u30f3',
		'Read Our Story': '\u79c1\u305f\u3061\u306e\u7269\u8a9e\u3092\u8aad\u3080',
		'Join the Panda Club': '\u30d1\u30f3\u30c0\u30af\u30e9\u30d6\u306b\u53c2\u52a0',
		'Exclusive Perks': '\u9650\u5b9a\u7279\u5178',
		'Get early access to new blind boxes and special plushie drops.': '\u65b0\u4f5c\u30d6\u30e9\u30a4\u30f3\u30c9\u30dc\u30c3\u30af\u30b9\u3084\u9650\u5b9a\u306c\u3044\u3050\u308b\u307f\u3092\u5148\u884c\u3067\u5165\u624b\u3067\u304d\u307e\u3059',
		'Panda Wonderland': '\u30d1\u30f3\u30c0\u30ef\u30f3\u30c0\u30fc\u30e9\u30f3\u30c9',
		'Panda Shop': '\u30d1\u30f3\u30c0\u30b7\u30e7\u30c3\u30d7',
		'Panda Collection': '\u30d1\u30f3\u30c0\u30b3\u30ec\u30af\u30b7\u30e7\u30f3',
		'About Us': '\u79c1\u305f\u3061\u306b\u3064\u3044\u3066',
		'Cute and playful panda cultural creative products.': '\u304b\u308f\u3044\u304f\u904a\u3073\u5fc3\u306e\u3042\u308b\u30d1\u30f3\u30c0\u6587\u5316\u30af\u30ea\u30a8\u30a4\u30c6\u30a3\u30d6\u5546\u54c1',
		'Explore the full panda catalog.': '\u30d1\u30f3\u30c0\u306e\u5168\u30ab\u30bf\u30ed\u30b0\u3092\u3054\u89a7\u304f\u3060\u3055\u3044',
		'Visual curation of our newest panda arrivals.': '\u6700\u65b0\u306e\u30d1\u30f3\u30c0\u65b0\u7740\u3092\u30d3\u30b8\u30e5\u30a2\u30eb\u3067\u3054\u7d39\u4ecb',
		'Spreading joy with cute pandas.': '\u304b\u308f\u3044\u3044\u30d1\u30f3\u30c0\u3067\u559c\u3073\u3092\u5c4a\u3051\u307e\u3059',
		'All Products': '\u3059\u3079\u3066\u306e\u5546\u54c1',
		'Plush Toys': '\u6bdb\u7d68\u3044\u3050\u308b\u307f',
		'Art Pieces': '\u30a2\u30fc\u30c8\u4f5c\u54c1',
		'Apparel Accessories': '\u30a2\u30d1\u30ec\u30eb\u30fb\u30a2\u30af\u30bb\u30b5\u30ea\u30fc',
		'Souvenirs': '\u8a18\u5ff5\u54c1',
		'Daily Products': '\u65e5\u7528\u54c1',
		'Digital Products': '\u30c7\u30b8\u30bf\u30eb\u88fd\u54c1',
		'Promo Products': '\u30d7\u30ed\u30e2\u5546\u54c1',
		'Added to bag': '\u30d0\u30c3\u30b0\u306b\u8ffd\u52a0\u3057\u307e\u3057\u305f'
	},
	zh: {
		Collection: '\u5408\u96c6',
		Shop: '\u5546\u5e97',
		Contact: '\u8054\u7cfb',
		About: '\u5173\u4e8e',
		Wishlist: '\u5fc3\u613f\u5355',
		SEARCH: '\u641c\u7d22',
		Search: '\u641c\u7d22',
		Account: '\u8d26\u6237',
		BAG: '\u8d2d\u7269\u888b',
		Bag: '\u8d2d\u7269\u888b',
		Language: '\u8bed\u8a00',
		Close: '\u5173\u95ed',
		'Skip to Content': '\u8df3\u8f6c\u5230\u4e3b\u8981\u5185\u5bb9',
		'Join the Conversation': '\u8ba2\u9605\u6700\u65b0\u52a8\u6001',
		'Email Address': '\u90ae\u7bb1\u5730\u5740',
		'COOKIE SETTINGS': 'Cookie \u8bbe\u7f6e',
		'Cookies.': 'Cookie\u8bf4\u660e',
		'Essential Only': '\u4ec5\u5fc5\u8981\u9879',
		Accept: '\u63a5\u53d7',
		'Shopping Bag': '\u8d2d\u7269\u888b',
		'Your bag is empty': '\u4f60\u7684\u8d2d\u7269\u888b\u4e3a\u7a7a',
		'Continue Shopping': '\u7ee7\u7eed\u8d2d\u7269',
		Remove: '\u79fb\u9664',
		Subtotal: '\u5c0f\u8ba1',
		Checkout: '\u7ed3\u8d26',
		'You have Free Shipping': '\u4f60\u5df2\u4eab\u53d7\u5305\u90ae',
		Spend: '\u518d\u6d88\u8d39',
		'more for Free Shipping': '\u5373\u53ef\u5305\u90ae',
		Filter: '\u7b5b\u9009',
		Clear: '\u6e05\u9664',
		Apply: '\u5e94\u7528',
		'No products found in this category': '\u8be5\u5206\u7c7b\u4e0b\u672a\u627e\u5230\u5546\u54c1',
		'View More Products': '\u67e5\u770b\u66f4\u591a\u5546\u54c1',
		'Order Summary': '\u8ba2\u5355\u6458\u8981',
		'Your cart is empty.': '\u4f60\u7684\u8d2d\u7269\u8f66\u4e3a\u7a7a',
		Total: '\u603b\u8ba1',
		'Place Demo Order': '\u63d0\u4ea4\u6f14\u793a\u8ba2\u5355',
		'Thank You For Your Order': '\u611f\u8c22\u4f60\u7684\u8ba2\u5355',
		'View My Account': '\u67e5\u770b\u6211\u7684\u8d26\u6237',
		'Questions? Email us at': '\u5982\u6709\u95ee\u9898\uff0c\u8bf7\u53d1\u90ae\u4ef6\u81f3',
		Location: '\u5730\u5740',
		'First Name': '\u540d',
		'Last Name': '\u59d3',
		Subject: '\u4e3b\u9898',
		Message: '\u6d88\u606f',
		'Sending...': '\u53d1\u9001\u4e2d...',
		'Send Message': '\u53d1\u9001\u6d88\u606f',
		'General Inquiry': '\u4e00\u822c\u54a8\u8be2',
		'Order Status': '\u8ba2\u5355\u72b6\u6001',
		'Returns & Exchanges': '\u9000\u6362\u8d27',
		'Press & Collaboration': '\u5a92\u4f53\u4e0e\u5408\u4f5c',
		Orders: '\u8ba2\u5355',
		Addresses: '\u5730\u5740',
		Status: '\u72b6\u6001',
		'Demo Signed In': '\u6f14\u793a\u5df2\u767b\u5f55',
		'Guest Session': '\u8bbf\u5ba2\u4f1a\u8bdd',
		'Address Book': '\u5730\u5740\u7c3f',
		Back: '\u8fd4\u56de',
		Home: '\u5bb6\u5ead',
		'Order History': '\u8ba2\u5355\u5386\u53f2',
		'Back to Dashboard': '\u8fd4\u56de\u9762\u677f',
		Order: '\u8ba2\u5355',
		'No orders yet': '\u6682\u65e0\u8ba2\u5355',
		'Start Shopping': '\u5f00\u59cb\u8d2d\u7269',
		'Back to History': '\u8fd4\u56de\u5386\u53f2',
		'Purchase Details': '\u8d2d\u4e70\u660e\u7ec6',
		'No Img': '\u65e0\u56fe',
		'Tax & Shipping': '\u7a0e\u8d39\u4e0e\u8fd0\u8d39',
		Discounts: '\u4f18\u60e0',
		'Placed on': '\u4e0b\u5355\u65f6\u95f4',
		Unknown: '\u672a\u77e5',
		'Shipping Address': '\u6536\u8d27\u5730\u5740',
		Tracking: '\u7269\u6d41\u8ffd\u8e2a',
		'Unknown Date': '\u672a\u77e5\u65e5\u671f',
		more: '\u4ef6',
		View: '\u67e5\u770b',
		'My Collection': '\u6211\u7684\u6536\u85cf',
		'The canvas is empty': '\u5f53\u524d\u8fd8\u6ca1\u6709\u6536\u85cf\u5546\u54c1',
		'Start Curating': '\u53bb\u901b\u901b',
		'Quick Add': '\u5feb\u901f\u52a0\u5165',
		'Remove from wishlist': '\u4ece\u5fc3\u613f\u5355\u79fb\u9664',
		'Add to wishlist': '\u52a0\u5165\u5fc3\u613f\u5355',
		'In Stock': '\u6709\u5e93\u5b58',
		'Move to Bag': '\u79fb\u5230\u8d2d\u7269\u888b',
		'Page Not Found': '\u9875\u9762\u4e0d\u5b58\u5728',
		'Something Went Wrong': '\u53d1\u751f\u9519\u8bef',
		'Return Home': '\u8fd4\u56de\u9996\u9875',
		'System Status': '\u7cfb\u7edf\u72b6\u6001',
		'Currently Under Maintenance': '\u5f53\u524d\u7ef4\u62a4\u4e2d',
		Maintenance: '\u7ef4\u62a4\u4e2d',
		Error: '\u9519\u8bef',
		'An unexpected error occurred.': '\u53d1\u751f\u4e86\u672a\u77e5\u9519\u8bef',
		'Size Guide': '\u5c3a\u7801\u6307\u5357',
		'ADD TO BAG': '\u52a0\u5165\u8d2d\u7269\u888b',
		'Material & Care': '\u6750\u8d28\u4e0e\u62a4\u7406',
		'Shipping & Returns': '\u914d\u9001\u4e0e\u9000\u6362',
		'You May Also Like': '\u4f60\u53ef\u80fd\u4e5f\u559c\u6b22',
		'No products to display': '\u6682\u65e0\u53ef\u5c55\u793a\u5546\u54c1',
		'Featured Products': '\u7cbe\u9009\u5546\u54c1',
		'View All': '\u67e5\u770b\u5168\u90e8',
		'Shop Now': '\u7acb\u5373\u8d2d\u4e70',
		Story: '\u6545\u4e8b',
		'SEARCH RESULTS': '\u641c\u7d22\u7ed3\u679c',
		PILLAR: '\u7cfb\u5217',
		'PRODUCT TYPE': '\u4ea7\u54c1\u7c7b\u578b',
		SIZES: '\u5c3a\u7801',
		COLOR: '\u989c\u8272',
		ALL: '\u5168\u90e8',
		PLUSHIES: '\u6bdb\u7ed2',
		STATIONERY: '\u6587\u5177',
		LIFESTYLE: '\u751f\u6d3b\u65b9\u5f0f',
		'Shop All Pandas': '\u9009\u8d2d\u5168\u90e8\u718a\u732b\u5546\u54c1',
		'Find your new friend': '\u627e\u5230\u4f60\u7684\u65b0\u4f19\u4f34',
		'See Collection': '\u67e5\u770b\u5408\u96c6',
		'Shop Plushies': '\u9009\u8d2d\u6bdb\u7ed2',
		'Shop Stationery': '\u9009\u8d2d\u6587\u5177',
		'Shop Plushies > New Arrivals': '\u9009\u8d2d\u6bdb\u7ed2 > \u65b0\u54c1',
		'Plush Toys > New Arrivals': '\u6bdb\u7ed2\u73a9\u5076 > \u65b0\u54c1',
		'Welcome to the Bamboo Forest': '\u6b22\u8fce\u6765\u5230\u7af9\u6797',
		'Our Collections': '\u6211\u4eec\u7684\u5408\u96c6',
		'Panda Favorites': '\u718a\u732b\u4eba\u6c14\u6b3e',
		'Most Loved': '\u6700\u53d7\u559c\u7231',
		'Designed For Joy': '\u4e3a\u5feb\u4e50\u800c\u8bbe\u8ba1',
		'Read Our Story': '\u9605\u8bfb\u6211\u4eec\u7684\u6545\u4e8b',
		'Join the Panda Club': '\u52a0\u5165\u718a\u732b\u4ff1\u4e50\u90e8',
		'Exclusive Perks': '\u4e13\u5c5e\u798f\u5229',
		'Get early access to new blind boxes and special plushie drops.': '\u62a2\u5148\u83b7\u5f97\u65b0\u54c1\u76f2\u76d2\u548c\u9650\u5b9a\u6bdb\u7ed2\u53d1\u552e\u8d44\u683c',
		'Panda Wonderland': '\u718a\u732b\u4e50\u56ed',
		'Panda Shop': '\u718a\u732b\u5546\u5e97',
		'Panda Collection': '\u718a\u732b\u5408\u96c6',
		'About Us': '\u5173\u4e8e\u6211\u4eec',
		'Cute and playful panda cultural creative products.': '\u53ef\u7231\u53c8\u5145\u6ee1\u8da3\u5473\u7684\u718a\u732b\u6587\u521b\u4ea7\u54c1',
		'Explore the full panda catalog.': '\u63a2\u7d22\u5b8c\u6574\u7684\u718a\u732b\u5546\u54c1\u76ee\u5f55',
		'Visual curation of our newest panda arrivals.': '\u4ee5\u89c6\u89c9\u65b9\u5f0f\u5448\u73b0\u6211\u4eec\u6700\u65b0\u7684\u718a\u732b\u65b0\u54c1',
		'Spreading joy with cute pandas.': '\u7528\u53ef\u7231\u7684\u718a\u732b\u4f20\u9012\u5feb\u4e50',
		'All Products': '\u6240\u6709\u4ea7\u54c1',
		'Plush Toys': '\u6bdb\u7ed2\u73a9\u5076',
		'Art Pieces': '\u827a\u672f\u54c1',
		'Apparel Accessories': '\u670d\u88c5\u914d\u9970',
		'Souvenirs': '\u7eaa\u5ff5\u54c1',
		'Daily Products': '\u65e5\u5e38\u4ea7\u54c1',
		'Digital Products': '\u6570\u7801\u4ea7\u54c1',
		'Promo Products': '\u4fc3\u9500\u4ea7\u54c1',
		'Added to bag': '\u5df2\u52a0\u5165\u8d2d\u7269\u888b'
	}
};

const NORMALIZED_TRANSLATIONS: Record<Exclude<LanguageCode, 'en'>, Record<string, string>> = {
	ja: Object.fromEntries(
		Object.entries(TRANSLATIONS.ja).map(([key, value]) => [key.toLowerCase(), value])
	),
	zh: Object.fromEntries(
		Object.entries(TRANSLATIONS.zh).map(([key, value]) => [key.toLowerCase(), value])
	)
};

let currentLanguage = $state<LanguageCode>('en');
let initialized = false;

function normalizeLanguage(value: unknown): LanguageCode {
	if (value === 'ja' || value === 'zh' || value === 'en') return value;
	return 'en';
}

function persistLanguage(lang: LanguageCode) {
	if (!browser) return;
	localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

export function initI18n() {
	if (!browser || initialized) return;
	initialized = true;
	const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
	currentLanguage = normalizeLanguage(stored);
}

function lookup(text: string): string {
	if (currentLanguage === 'en') return text;
	const table = TRANSLATIONS[currentLanguage];
	const direct = table[text];
	if (direct) return direct;
	const normalized = NORMALIZED_TRANSLATIONS[currentLanguage][text.toLowerCase()];
	return normalized || text;
}

function translateText(text: string | null | undefined) {
	if (text == null) return '';
	const source = String(text);
	const trimmed = source.trim();
	if (!trimmed) return source;

	const translated = lookup(trimmed);
	if (translated === trimmed) return source;
	return source.replace(trimmed, translated);
}

function translateHtml(html: string | null | undefined) {
	if (!html) return '';
	if (currentLanguage === 'en') return html;

	const table = TRANSLATIONS[currentLanguage];
	let output = html;
	for (const [from, to] of Object.entries(table).sort((a, b) => b[0].length - a[0].length)) {
		output = output.replaceAll(from, to);
	}
	return output;
}

function setLanguage(lang: LanguageCode) {
	const normalized = normalizeLanguage(lang);
	currentLanguage = normalized;
	persistLanguage(normalized);
}

export const i18n = {
	get language() {
		return currentLanguage;
	},
	get options() {
		return LANGUAGE_OPTIONS;
	},
	setLanguage,
	tx: translateText,
	txHtml: translateHtml
};


