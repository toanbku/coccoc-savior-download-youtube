try {
	window.trustedTypes.createPolicy('default', {
		createScript: function (string) { return string; }
	});
} catch (error) {
	//
}

try {
	const attrString = document.body.getAttribute('savior-meta-formats');
	const formats = JSON.parse(attrString);
	for (let i = 0; i < formats.length; i++) {
		const { decodeFunc, decodeArgs } = formats[i];
		if (decodeFunc) {
			let decoded;
			if (window.trustedTypes.defaultPolicy) {
				decoded = eval(window.trustedTypes.defaultPolicy.createScript(decodeFunc));
			} else {
				decoded = eval(decodeFunc);
			}
			if (decoded) {
				formats[i].url = formats[i].url.replace(
					'n=' + decodeArgs.c,
					'n=' + encodeURIComponent(decoded)
				);
			}
		}
	}

	document.body.setAttribute('savior-decoded-meta-formats', JSON.stringify(formats));
} catch (error) {
	console.warn(error);
	document.body.setAttribute('savior-decoded-meta-formats', '[]');
}
