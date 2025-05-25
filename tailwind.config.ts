import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import defaultTheme

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        // Set the sans-serif font family to use the Inter variable
        sans: ["var(--font-inter)", ...fontFamily.sans],
        // Add Amiri font variable for Arabic/Serif styles
        arabic: ["var(--font-amiri)", "var(--font-noto-kufi)", ...fontFamily.serif], // Added Noto Kufi
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
            primary: { // Green
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
            accent: { // Red
                DEFAULT: 'hsl(var(--accent))',
                foreground: 'hsl(var(--accent-foreground))'
            },
            destructive: { // Also Red
                DEFAULT: 'hsl(var(--destructive))',
                foreground: 'hsl(var(--destructive-foreground))'
            },
            // Use direct border color definitions based on CSS variables
            border: 'hsl(var(--border))', // Default border color from CSS variable
            'primary-border': 'hsl(var(--border-primary))', // Custom name for primary border color
            'accent-border': 'hsl(var(--border-accent))', // Custom name for accent border color
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))', // Green focus ring
            chart: {
                '1': 'hsl(var(--chart-1))',
                '2': 'hsl(var(--chart-2))',
                '3': 'hsl(var(--chart-3))',
                '4': 'hsl(var(--chart-4))',
                '5': 'hsl(var(--chart-5))'
            }
        },
        borderColor: theme => ({ // Explicitly define border colors using theme() helper
             DEFAULT: theme('colors.border'),
             primary: theme('colors.primary-border'), // Use the custom names defined above
             accent: theme('colors.accent-border'),
        }),
  		borderRadius: { // Set all border radius to 0rem for square edges
            none: '0',
            sm: '0rem',
            DEFAULT: '0rem',
            md: '0rem',
            lg: '0rem',
            xl: '0rem',
            '2xl': '0rem',
            '3xl': '0rem',
            full: '9999px' // Keep full for specific circular elements if needed (e.g., avatar fallback)
        },
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
            'count-up': {
                from: { opacity: '0', transform: 'translateY(5px)' },
                to: { opacity: '1', transform: 'translateY(0)' },
            },
            'ticker-scroll': {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(-100%)' },
            },
            'spin': { // Ensure spin animation is defined
               to: { transform: 'rotate(360deg)' },
            },
             'loading-bar-indeterminate': { // Keyframe for indeterminate loading bar
                 '0%': { transform: 'translateX(-100%) scaleX(0.1)' },
                 '50%': { transform: 'translateX(0%) scaleX(0.8)' },
                 '100%': { transform: 'translateX(100%) scaleX(0.1)' },
             },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
            'count-up': 'count-up 0.3s ease-out forwards',
            'ticker-scroll': 'ticker-scroll 20s linear infinite',
            'spin': 'spin 1s linear infinite', // Use spin animation
            'loading-bar-indeterminate': 'loading-bar-indeterminate 1.5s infinite ease-in-out', // Use indeterminate loading bar animation
        }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
