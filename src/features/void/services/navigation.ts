let canUseHistoryApi: boolean | null = null;

const checkHistoryApiAccess = (): boolean => {
    if (canUseHistoryApi === null) {
        try {
            const currentPath = window.location.pathname + window.location.search + window.location.hash;
            // Use replaceState to avoid adding to history, it's just a test
            history.replaceState(null, '', currentPath);
            canUseHistoryApi = true;
        } catch (e) {
            console.warn("Browser history access denied. Falling back to memory routing.");
            canUseHistoryApi = false;
        }
    }
    return canUseHistoryApi;
};

// This custom event will notify the app of route changes in memory-only mode.
export const MEMORY_ROUTE_CHANGE_EVENT = 'memoryroutechange';

export const safeNavigate = (path: string) => {
    // Ensure path starts with #/ for consistency
    const fullPath = path.startsWith('#/') ? path : `#/${path.replace(/^[#\/]+/, '')}`;

    if (checkHistoryApiAccess()) {
        const currentHash = window.location.hash;
        // Only push state if the hash is actually different to avoid unnecessary history entries
        if (currentHash !== fullPath) {
             history.pushState(null, '', fullPath);
        }
        // Dispatch hashchange to ensure listeners react
        window.dispatchEvent(new Event('hashchange'));
    } else {
        // Fallback: dispatch a custom event for the app to handle internally.
        window.dispatchEvent(new CustomEvent(MEMORY_ROUTE_CHANGE_EVENT, {
            detail: { hash: fullPath }
        }));
    }
};
