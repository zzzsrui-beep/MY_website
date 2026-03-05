import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import {
	Users,
	Navigation,
	Pages,
	UISections,
	UIAssets,
	Categories,
	Products,
	CollectionPanels
} from './src/collections';
import { SiteSettings, Header, Footer } from './src/globals';

export default buildConfig({
	secret: process.env.PAYLOAD_SECRET || 'replace-me',
	serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
	editor: lexicalEditor(),
	collections: [Users, Navigation, Pages, UISections, UIAssets, Categories, Products, CollectionPanels],
	globals: [SiteSettings, Header, Footer]
});
