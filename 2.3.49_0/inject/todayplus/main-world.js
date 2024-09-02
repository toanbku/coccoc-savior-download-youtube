/* eslint-disable no-undef */
let arrayToHeap = function arrayToHeap(typedArray) {
	let numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;

	let ptr = window.Module._malloc(numBytes);

	let heapBytes = new Uint8Array(window.Module.HEAPU8.buffer, ptr, numBytes);
	heapBytes.set(new Uint8Array(typedArray.buffer));
	return heapBytes;
};

let freeArray = function freeArray(heapBytes) {
	window.Module._free(heapBytes.byteOffset);
};

let hex2buf = function hex2buf(hex) {
	if (typeof hex !== 'string') {
		throw new TypeError('Expected input to be a string');
	}

	if (hex.length % 2 !== 0) {
		throw new RangeError('Expected string to be an even number of characters');
	}

	let view = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}

	return view.buffer;
};

let buf2hex = (buffer) => { // buffer is an ArrayBuffer
	return [...new Uint8Array(buffer)]
		.map(x => x.toString(16).padStart(2, '0'))
		.join('');
};

function base64ToArrayBuffer(base64) {
	let binaryString = atob(base64);
	let len = binaryString.length;
	let bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++)        {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

(function() {
	Array.from(document.querySelectorAll('[savior-key-bytes]')).map($el => {
		try {
			let base64KeyBytes = $el.getAttribute('savior-key-bytes');
			let keyBytes = base64ToArrayBuffer(base64KeyBytes);
			let heapKeyBytes = arrayToHeap(new Uint8Array(keyBytes));
			keyBytes = hex2buf(window.Module.ccall('emcc', 'string', ['number', 'number'], [heapKeyBytes.byteOffset, heapKeyBytes.byteLength]));
			freeArray(heapKeyBytes);

			let view = new DataView(keyBytes);
			let bytes = new Uint32Array([view.getUint32(0), view.getUint32(4), view.getUint32(8), view.getUint32(12)]);

			$el.setAttribute('savior-key-processed', buf2hex(bytes));
		// eslint-disable-next-line no-empty
		} catch (error) {
			console.error(error);
		}
	});
})();