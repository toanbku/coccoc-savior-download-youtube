
function getVideoUrlFromNode(node) {
	try {
		const player = node.parentElement.player;
		if (player && player.lastSource_ && player.lastSource_.player) {
			return player.lastSource_.player;
		}

		return undefined;
	} catch (error) {
		return null;
	}
}

(() => {
	const videos = document.querySelectorAll('video');
	if (videos) {
		Array.from(videos).filter(v => v).forEach($node => {
			let detail = getVideoUrlFromNode($node);

			if (detail) {
				$node.setAttribute('savior-manifest-url', detail);
			}
		});
	}
	return;

})();