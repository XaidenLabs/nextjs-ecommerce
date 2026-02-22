try {
    const f = require('fabric');
    console.log('Keys:', Object.keys(f));
    if (f.fabric) console.log('Has fabric property');
    if (f.Canvas) console.log('Has Canvas property');
    if (f.default) console.log('Has default property');
} catch (e) {
    console.error(e);
}
