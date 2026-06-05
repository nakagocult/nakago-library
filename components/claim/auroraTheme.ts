import { darkTheme } from 'thirdweb/react';

/** thirdweb wallet UI restyled to the Naka aurora palette so it never looks default. */
export const auroraTheme = darkTheme({
  colors: {
    modalBg: '#0c0c0c',
    borderColor: 'rgba(255,77,0,0.20)',
    accentText: '#FF4D00',
    accentButtonBg: '#FF4D00',
    accentButtonText: '#ffffff',
    primaryButtonBg: 'linear-gradient(135deg, #FF4D00, #FF0000)',
    primaryButtonText: '#ffffff',
    secondaryButtonBg: 'rgba(255,255,255,0.05)',
    secondaryButtonText: 'rgba(255,255,255,0.85)',
    secondaryButtonHoverBg: 'rgba(255,77,0,0.12)',
    connectedButtonBg: 'rgba(255,255,255,0.04)',
    connectedButtonBgHover: 'rgba(255,77,0,0.10)',
    primaryText: '#ffffff',
    secondaryText: 'rgba(255,255,255,0.55)',
    separatorLine: 'rgba(255,255,255,0.08)',
    tooltipBg: '#111111',
  },
});
