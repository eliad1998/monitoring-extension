declare const browser: typeof chrome | undefined;

interface MonitoringRule {
    id: number;
    name: string;
    pattern: string;
    type: string;
    description?: string;
}



export const fetchUserMonitoringRules = async (username: string): Promise<MonitoringRule[]> => {
    try {
        const LIST_MONITORING_API_URL = process.env.PLASMO_PUBLIC_API_URL + '/monitoring/list_monitoring_rules';
        const response = await fetch(`${LIST_MONITORING_API_URL}/${username}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch monitoring rules: ${response.statusText}`);
        }

        const data: MonitoringRule[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching monitoring rules:", error);
        return [];
    }
};


export const monitorWebRequestsForUser = async (username: string): Promise<void> => {

    const browserApi = (typeof chrome !== 'undefined' && chrome.runtime)
        ? chrome
        : (typeof browser !== 'undefined' ? browser : undefined);

    if (!browserApi || !browserApi.webRequest) {
        console.error("Web Request API not found! Ensure script runs in Background context and permissions are set.");
    }

    else {
        const monitoring_rules = await fetchUserMonitoringRules(username);
        const regexPatterns = monitoring_rules.map(rule => rule.pattern)

        console.log(`Setting up web request monitoring for patterns:`, regexPatterns);
        browserApi.webRequest.onCompleted.addListener(
            (details) => {
                console.log("HTTP request detected:", details.url);
            },
            { urls: regexPatterns }
        );
    }
}
