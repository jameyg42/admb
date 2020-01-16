function xor(str) {
  const enc = str.split('')
    .map((c,i) => String.fromCharCode(c.charCodeAt(0) ^ '_'.charCodeAt(0)))
    .join('');
  return enc;
}

module.exports = xor;
