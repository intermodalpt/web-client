import adapter from '@sveltejs/adapter-node';
import { svelte_client_components } from 'svelte-client-components';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: svelte_client_components(),
	kit: {
		adapter: adapter()
	}
};

export default config;
