async function decodeFileContent(data, key = 'ZG1fdGhhbmdfc3VjX3ZhdF9nZXRfbGlua19hbl9kYnQ=') {
	try {

		const crypto = window.crypto;
		const encodedKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(atob(key)));
		const UnEt = Uint8Array.from(atob(data), (v) => v.charCodeAt(0));
		const Qizt = UnEt.slice(0, 16);
		const sItr = UnEt.slice(16);
		const Ufwr = {
			name: 'AES-CBC',
			iv: Qizt,
		};
		const oDor = Ufwr;

		const Qarr = await crypto.subtle.importKey('raw', encodedKey, oDor, false, ['decrypt']);
		const kyjr = await crypto.subtle.decrypt(oDor, Qarr, sItr);

		// pako
		const M5lr = window.pako.inflateRaw(new Uint8Array(kyjr), {
			to: 'string'
		});
		return JSON.parse(M5lr);
	} catch (err) {
		console.warn('Error decrypting data:', err);
		return null;
	}

}

(async () => {
	const $el = document.querySelector('[savior-decode-needed]');
	const jsonStr = $el?.getAttribute('savior-decode-needed');

	try {
		const data = JSON.parse(jsonStr);
		const links = (await Promise.allSettled(data.link.map((link) => {
			if (link?.file.includes('.mp4')) {
				return Promise.resolve({
					type: 'link',
					data: link.file,
				});
			}
			return decodeFileContent(link.file).then(data => ({
				type: 'm3u8-content',
				data,
			}));
		}))).filter(m => m.status == 'fulfilled').map(res => res.value);

		$el.setAttribute('savior-decoded-content', JSON.stringify(links));
	} catch (error) {
		$el.setAttribute('savior-decoded-content', JSON.stringify([]));
	} finally {
		$el.removeAttribute('savior-decode-needed');
	}


	return;

})();