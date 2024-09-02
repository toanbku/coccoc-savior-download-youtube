function sendMessage(tid, msg, frameId) {
	let promise;
	if (tid) {
		if (frameId || frameId === 0) {
			promise = chrome.tabs.sendMessage(tid, msg, {frameId});
		} else {
			promise = chrome.tabs.sendMessage(tid, msg);
		}
	} else {
		promise = chrome.runtime.sendMessage(msg);
	}

	promise?.catch?.(console.log);
}

// setTimeout(() => {
// 	sendMessage(null, { type: 'offscreen_open_onboarding' }, 0);
// }, 1800000);
