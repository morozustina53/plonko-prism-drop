/**
 * CYBERPUNK preset (design-system/presets.ts), accents tuned to a prism spectrum.
 * The `name` field stays the preset name literally — see CODE RULE #11b.
 */
export const theme = {
  name: 'CYBERPUNK',

  colors: {
    bgDeep: '#050010',
    bg: '#0A0014',
    surface: '#120026',
    surfaceRaised: '#1A0038',
    surfaceAlt: '#2A1140',

    violet: '#8B00FF',
    cyan: '#00D4FF',
    magenta: '#FF2FB9',
    mint: '#19F6C8',

    textPrimary: '#F2EAFF',
    textSecondary: '#A89CC8',
    textMuted: '#6E6395',

    hairline: 'rgba(242,234,255,0.10)',
    glass: 'rgba(242,234,255,0.06)',
    glassStrong: 'rgba(242,234,255,0.12)',
    scrim: 'rgba(0,0,0,0.32)',
  },

  radius: {sm: 12, md: 16, lg: 20, xl: 24, xxl: 28},

  space: {xs: 6, sm: 10, md: 14, lg: 20, xl: 28},

  font: {
    hero: 38,
    score: 46,
    title: 30,
    verdict: 28,
    section: 18,
    body: 14,
    caption: 12,
    micro: 11,
  },
} as const;

export type Theme = typeof theme;
