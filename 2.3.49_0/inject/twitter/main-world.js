function getReactKey(node) {
	let reactKey = '';
	const keys = Object.keys(node);
	for (let j=0;j<keys.length;j++) {
		if (keys[j].indexOf ('__reactFiber') != -1) {
			reactKey = keys[j].split('__reactFiber')[1];
			break;
		}
	}

	return reactKey;
}

function findVideoUrl(node) {
	let el = node;
	let config = null;
	let reactKey = '';
	while (el.nodeName !== 'ARTICLE' && el.nodeName !== 'BODY') {
		if (!reactKey) {
			reactKey = getReactKey(el);
		}
		let source = el[`__reactProps${reactKey}`]?.children?.props?.source;
		if (source) {
			config = source;
			break;
		}
		el = el.parentElement;
	}

	if (config) {
		node.setAttribute('savior-twitter-vid', config.contentId);
		node.setAttribute('savior-twitter-source', JSON.stringify(config));
	}
}

(() => {
	const videos = document.querySelectorAll('video');
	for (let i = 0, len = videos.length; i < len; i++) {
		findVideoUrl(videos[i]);
	}

	return;

})();