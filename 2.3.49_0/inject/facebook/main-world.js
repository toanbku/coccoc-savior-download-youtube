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

function findDashManifestUrl(node) {
	const reactKey = getReactKey(node);
	let manifestUrl = node.parentElement?.[`__reactProps${reactKey}`].children?.props?.manifestUrl;
	if (!manifestUrl) {
		let $travel = node;
		while ($travel && $travel.parentElement && $travel.parentElement.tagName != 'BODY' && $travel.parentElement.tagName != 'HTML') {
			if ($travel?.['__reactProps'+reactKey]?.children?.props?.manifestUrl) {
				manifestUrl = $travel['__reactProps'+reactKey].children.props.manifestUrl;
				break;
			}
			$travel = $travel.parentElement;
		}
	}

	if (manifestUrl) {
		node.setAttribute('savior-manifest-url', manifestUrl);
	}
}

function getPostDetailFromNode(node) {
	try {
		const reactKey = getReactKey(node);

		const $wrapper = node.parentElement;
		let post = $wrapper[`__reactProps${reactKey}`]?.children[0]?.props?.post || $wrapper[`__reactProps${reactKey}`]?.children?.props?.dashInfo || node?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.['__reactProps'+reactKey]?.children?.props?.dashInfo;

		if (!post) {
			let $travel = node;
			while ($travel && $travel.parentElement && $travel.parentElement.tagName != 'BODY' && $travel.parentElement.tagName != 'HTML') {
				if ($travel?.['__reactProps'+reactKey]?.children?.props?.manifestUrl) {
					return $travel['__reactProps'+reactKey].children.props;
				}
				$travel = $travel.parentElement;
			}
			$travel = node;
			while ($travel && $travel.parentElement && $travel.parentElement.tagName != 'BODY' && $travel.parentElement.tagName != 'HTML') {
				if ($travel?.['__reactProps'+reactKey]?.children?.props?.hdSrc || $travel?.['__reactProps'+reactKey]?.children?.props?.sdSrc) {
					return $travel['__reactProps'+reactKey].children.props;
				}
				$travel = $travel.parentElement;
			}
		}


		return post;
	} catch (error) {
		return null;
	}
}

(() => {
	const videos = document.querySelectorAll('video');
	for (let i = 0, len = videos.length; i < len; i++) {
		const $node = videos[i];
		findDashManifestUrl($node);

		try {
			let detail = getPostDetailFromNode($node);

			if (detail) {
				$node.setAttribute('savior-video-detail', JSON.stringify(detail));
			}
		} catch (error) {
			// do nothing
		}
	}

	return;

})();