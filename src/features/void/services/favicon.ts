
const FAVICON_SVG_STATIC = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 7L7 12L12 17L17 12L12 7Z" fill="white"/></svg>`;

const FAVICON_SVG_ANIMATED = `
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .outline {
        stroke-dasharray: 80;
        stroke-dashoffset: 80;
        animation: draw 2s ease-in-out forwards infinite;
    }
    .center {
        opacity: 0;
        transform-origin: center;
        animation: pulse 2s ease-in-out forwards infinite;
    }
    @keyframes draw {
        50% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -80; }
    }
    @keyframes pulse {
        0% { opacity: 0; transform: scale(0.5); }
        20%, 100% { opacity: 1; transform: scale(1); }
        40% { transform: scale(1.1); }
    }
  </style>
  <path class="outline" d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
  <path class="center" d="M12 7L7 12L12 17L17 12L12 7Z" fill="white"/>
</svg>
`;

const setFavicon = (svg: string) => {
    try {
        const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/svg+xml';
        link.rel = 'icon';
        link.href = `data:image/svg+xml;base64,${btoa(svg)}`;
        if (!link.parentNode) {
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    } catch (e) {
        console.error("Failed to update favicon", e);
    }
};

export const setBuildingFavicon = () => {
    setFavicon(FAVICON_SVG_ANIMATED);
};

export const resetFavicon = () => {
    setFavicon(FAVICON_SVG_STATIC);
};
