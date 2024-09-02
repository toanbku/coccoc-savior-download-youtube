
(() => {
	chrome.runtime.sendMessage (null, {
		type: 'script_executed',
		data: {
			data: {
				origin: location.host
			}
		}
	});
})();