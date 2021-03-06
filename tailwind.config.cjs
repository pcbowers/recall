const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		styled: true,
		themes: [
			{
				light: {
					primary: '#546E9E',
					'primary-focus': '#344159',
					'primary-content': '#ffffff',
					secondary: '#94595A',
					'secondary-focus': '#704646',
					'secondary-content': '#ffffff',
					accent: '#B59C6D',
					'accent-focus': '#7A653E',
					'accent-content': '#ffffff',
					neutral: '#3d4451',
					'neutral-focus': '#2a2e37',
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f9fafb',
					'base-300': '#d1d5db',
					'base-content': '#1f2937',
					info: '#4097DD',
					success: '#6a994e',
					warning: '#E5B720',
					error: '#FF2727',
					'--rounded-box': '1rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '1.9rem',
					'--animation-btn': '0.25s',
					'--animation-input': '.2s',
					'--padding-card': '2rem',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '0.95',
					'--navbar-padding': '.5rem',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem',
					'--tab-spacer': '0.5rem',
					'--focus-ring': '2px',
					'--focus-ring-offset': '2px',
					'--glass-opacity': '30%',
					'--glass-border-opacity': '10%',
					'--glass-reflex-degree': '100deg',
					'--glass-reflex-opacity': '10%',
					'--glass-blur': '40px',
					'--glass-text-shadow-opacity': '5%'
				},
				dark: {
					primary: '#546E9E',
					'primary-focus': '#344159',
					'primary-content': '#ffffff',
					secondary: '#94595A',
					'secondary-focus': '#704646',
					'secondary-content': '#ffffff',
					accent: '#B59C6D',
					'accent-focus': '#7A653E',
					'accent-content': '#ffffff',
					neutral: '#2a2e37',
					'neutral-focus': '#16181d',
					'neutral-content': '#ffffff',
					'base-100': '#3d4451',
					'base-200': '#2a2e37',
					'base-300': '#16181d',
					'base-content': '#ebecf0',
					info: '#66c6ff',
					success: '#87d039',
					warning: '#e2d562',
					error: '#ff6f6f',
					'--rounded-box': '1rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '1.9rem',
					'--animation-btn': '0.25s',
					'--animation-input': '.2s',
					'--padding-card': '2rem',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '0.95',
					'--navbar-padding': '.5rem',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem',
					'--tab-spacer': '0.5rem',
					'--focus-ring': '2px',
					'--focus-ring-offset': '2px',
					'--glass-opacity': '30%',
					'--glass-border-opacity': '10%',
					'--glass-reflex-degree': '100deg',
					'--glass-reflex-opacity': '10%',
					'--glass-blur': '40px',
					'--glass-text-shadow-opacity': '5%'
				}
			},
			'light',
			'dark'
		],
		base: true,
		utils: true,
		logs: false,
		rtl: false
	}
};

module.exports = config;
