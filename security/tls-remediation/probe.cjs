const tls = require('tls');
const targets = [
  ['dv-g3b-emudhra.we-have-a-problem.com', false],
  ['dv-g3b-aaa-emudhra.we-have-a-problem.com', false],
  ['api.openai.com', true],
  ['api.telegram.org', true],
  ['accounts.google.com', true],
];
const certErrors = new Set(['UNABLE_TO_GET_ISSUER_CERT_LOCALLY','UNABLE_TO_VERIFY_LEAF_SIGNATURE','CERT_REVOKED','CERT_UNTRUSTED']);
(async () => {
  let failures = 0;
  for (const [host, allowed] of targets) {
    const result = await new Promise(resolve => {
      const socket = tls.connect({host, port:443, servername:host, rejectUnauthorized:true},()=>{resolve('ACCEPTED');socket.destroy();});
      socket.setTimeout(10000,()=>{resolve('TIMEOUT');socket.destroy();});
      socket.on('error', e => resolve(e.code));
    });
    const ok = allowed ? result === 'ACCEPTED' : certErrors.has(result);
    console.log(host, result, ok ? 'PASS' : 'FAIL');
    if (!ok) failures++;
  }
  process.exitCode = failures ? 1 : 0;
})();
