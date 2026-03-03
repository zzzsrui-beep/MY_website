const DANGEROUS_BLOCK_TAGS =
	/<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const DANGEROUS_SINGLE_TAGS = /<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?>/gi;
const EVENT_HANDLER_ATTR = /\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const JAVASCRIPT_PROTOCOL_QUOTED = /\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi;
const JAVASCRIPT_PROTOCOL_UNQUOTED = /\s(href|src)\s*=\s*javascript:[^\s>]+/gi;
const DATA_HTML_PROTOCOL_QUOTED = /\s(href|src)\s*=\s*(['"])\s*data:text\/html[\s\S]*?\2/gi;
const DATA_HTML_PROTOCOL_UNQUOTED = /\s(href|src)\s*=\s*data:text\/html[^\s>]+/gi;

export function sanitizeHtml(input: string | null | undefined): string {
	if (!input) return '';

	return input
		.replace(DANGEROUS_BLOCK_TAGS, '')
		.replace(DANGEROUS_SINGLE_TAGS, '')
		.replace(EVENT_HANDLER_ATTR, '')
		.replace(JAVASCRIPT_PROTOCOL_QUOTED, ' $1="#"')
		.replace(JAVASCRIPT_PROTOCOL_UNQUOTED, ' $1="#"')
		.replace(DATA_HTML_PROTOCOL_QUOTED, ' $1="#"')
		.replace(DATA_HTML_PROTOCOL_UNQUOTED, ' $1="#"');
}

export function escapeJsonForHtmlScript(json: string): string {
	return json
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}
