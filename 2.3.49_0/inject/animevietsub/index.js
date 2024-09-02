
(() => {

	let interval = null;

	interval = setInterval(() => {
		const data = document.body.getAttribute('savior-decoded-content');
		if (data) {
			chrome.runtime.sendMessage (null, {
				type: 'script_executed',
				data: {
					data,
				}
			});
			clearInterval(interval);
		}
	}, 300);
})();