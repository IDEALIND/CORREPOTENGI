function getCRC16(payload) {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= (payload.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

function generatePixPayload(amount) {
    const pixKey = "bieldamidia.a@outlook.com";
    const name = "N";
    const city = "C";
    const txid = "CORREPOTENGI";

    const formattedAmount = Number(amount).toFixed(2);

    const merchantAccount = formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', pixKey);

    let payload = 
        formatField('00', '01') +
        formatField('26', merchantAccount) +
        formatField('52', '0000') +
        formatField('53', '986') +
        formatField('54', formattedAmount) +
        formatField('58', 'BR') +
        formatField('59', name) +
        formatField('60', city) +
        formatField('62', formatField('05', txid)) +
        '6304';

    const crc = getCRC16(payload);
    return payload + crc;
}

console.log("R$ 59.99:", generatePixPayload(59.99));
console.log("R$ 119.98:", generatePixPayload(119.98));
