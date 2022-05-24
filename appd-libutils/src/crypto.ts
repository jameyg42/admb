export function xor(str:string, x:number='_'.charCodeAt(0)) {
    const enc = str.split('')
      .map((c,i) => String.fromCharCode(c.charCodeAt(0) ^ x))
      .join('');
    return enc;
}
