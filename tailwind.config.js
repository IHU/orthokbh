/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./packages/core/src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				body: ['var(--font-body)', 'system-ui', 'sans-serif'],
				headline: ['var(--font-headline)', 'var(--font-body)', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': theme('colors.foreground'),
						'--tw-prose-headings': theme('colors.foreground'),
						'--tw-prose-links': theme('colors.primary.DEFAULT'),
						'--tw-prose-bold': theme('colors.foreground'),
						'--tw-prose-bullets': theme('colors.primary.DEFAULT'),
						'--tw-prose-hr': theme('colors.border'),
						'--tw-prose-quotes': theme('colors.muted.foreground'),
						'--tw-prose-code': theme('colors.primary.DEFAULT'),
						'--tw-prose-th-borders': theme('colors.border'),
						'--tw-prose-td-borders': theme('colors.border'),
						a: {
							fontWeight: '500',
							textDecoration: 'none',
							borderBottom: `1px solid ${theme('colors.primary.DEFAULT')}`,
							transitionProperty: 'color, border-color',
							transitionDuration: '150ms',
							'&:hover': {
								color: theme('colors.primary.foreground'),
								borderBottomColor: theme('colors.primary.foreground')
							}
						},
						'h1,h2,h3,h4': {
							fontFamily: 'inherit',
							fontWeight: '600',
							color: theme('colors.foreground'),
							scrollMarginTop: theme('spacing.24')
						},
						h1: {
							fontSize: 'clamp(2.25rem, 1.5rem + 1.5vw, 3.5rem)',
							lineHeight: '1.1'
						},
						h2: {
							fontSize: 'clamp(1.875rem, 1.4rem + 0.9vw, 2.75rem)',
							lineHeight: '1.15'
						},
						h3: {
							fontSize: 'clamp(1.5rem, 1.2rem + 0.6vw, 2.125rem)',
							lineHeight: '1.2'
						},
						h4: {
							fontSize: 'clamp(1.25rem, 1.05rem + 0.4vw, 1.75rem)',
							lineHeight: '1.25'
						},
						h5: {
							fontSize: 'clamp(1.125rem, 1rem + 0.3vw, 1.5rem)'
						},
						h6: {
							fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.25rem)'
						},
						p: {
							marginBottom: theme('spacing.4'),
							color: theme('colors.foreground'),
							fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
							lineHeight: '1.75'
						},
						ul: {
							paddingLeft: theme('spacing.6'),
							marginTop: theme('spacing.4'),
							marginBottom: theme('spacing.4'),
							listStylePosition: 'outside'
						},
						ol: {
							paddingLeft: theme('spacing.6'),
							marginTop: theme('spacing.4'),
							marginBottom: theme('spacing.4'),
							listStylePosition: 'outside'
						},
						code: {
							backgroundColor: theme('colors.muted.DEFAULT'),
							color: theme('colors.primary.DEFAULT'),
							padding: `${theme('spacing[0.5]')} ${theme('spacing[1.5]')}`,
							borderRadius: theme('borderRadius.sm'),
							fontWeight: '500'
						},
						img: {
							borderRadius: theme('borderRadius.lg'),
							marginTop: theme('spacing.6'),
							marginBottom: theme('spacing.6')
						},
						blockquote: {
							borderLeftColor: theme('colors.primary.DEFAULT'),
							backgroundColor: theme('colors.muted.DEFAULT'),
							padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
							borderRadius: theme('borderRadius.md')
						},
						table: {
							tableLayout: 'auto',
							width: '100%'
						},
						th: {
							backgroundColor: theme('colors.muted.DEFAULT'),
							fontWeight: '600'
						}
					}
				},
				invert: {
					css: {
						'--tw-prose-body': theme('colors.muted.foreground'),
						'--tw-prose-headings': theme('colors.foreground'),
						'--tw-prose-links': theme('colors.primary.DEFAULT'),
						'--tw-prose-bullets': theme('colors.primary.DEFAULT'),
						blockquote: {
							borderLeftColor: theme('colors.primary.DEFAULT'),
							backgroundColor: theme('colors.secondary.DEFAULT')
						},
						code: {
							backgroundColor: theme('colors.secondary.DEFAULT'),
							color: theme('colors.primary.DEFAULT')
						}
					}
				}
			})
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}
