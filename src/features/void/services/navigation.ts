let canUseHistoryApi: boolean | null = null;

const checkHistoryApiAccess = (): boolean => {
    if (canUseHistoryApi === null) {
        try {
            const currentPath = window.location.pathname + window.location.search;
            history.replaceState(null, '', currentPath);
            canUseHistoryApi = true;
        } catch (e) {
            console.warn("Browser history access denied. Falling back to memory routing.");
            canUseHistoryApi = false;
        }
    }
    return canUseHistoryApi;
};

export const MEMORY_ROUTE_CHANGE_EVENT = 'memoryroutechange';

export const safeNavigate = (path: string) => {
    // Standardize path to ensure it's a valid relative URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // For the new Office Hub integration, we want to ensure we stay within the React Router context.
    // We dispatch a custom event that can be caught globally if needed, 
    // but the most reliable way for this specific architecture is a direct pushState + popstate.

    if (checkHistoryApiAccess()) {
        window.history.pushState(null, '', cleanPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
        window.location.href = cleanPath;
    }
};

