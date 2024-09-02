
(() => {

	const MAX_RUNTIME = 20;
	let runtime = 0;
	let interval = null;

	interval = setInterval(() => {
		try {
			const data = document.body.getAttribute('savior-decoded-meta-formats');
			if (data) {
				clearInterval(interval);
				const formats = JSON.parse(data);
				chrome.runtime.sendMessage (null, {
					type: 'script_executed',
					data: {
						url: formats,
						data: formats,
					}
				});
			}
			if (runtime > MAX_RUNTIME) {
				clearInterval(interval);
				return;
			}
			runtime++;
		} catch (error) {
			clearInterval(interval);
			chrome.runtime.sendMessage (null, {
				type: 'script_executed',
			});
		}
	}, 300);
})();