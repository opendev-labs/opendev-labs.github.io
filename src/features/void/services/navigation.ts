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

    if (checkHistoryApiAccess()) {
        const currentPath = window.location.pathname;
        if (currentPath !== cleanPath) {
            history.pushState(null, '', cleanPath);
        }
        // Dispatch popstate to ensure standard listeners react
        window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
        window.dispatchEvent(new CustomEvent(MEMORY_ROUTE_CHANGE_EVENT, {
            detail: { path: cleanPath }
        }));
    }
};

