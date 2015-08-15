
var _hash = {
		init: SHA256_init,
		update: SHA256_write,
		getBytes: SHA256_finalize
	};

function byteArrayToBigInteger(byteArray, startIndex) {
		var value = new BigInteger("0", 10);
		var temp1, temp2;
		for (var i = byteArray.length - 1; i >= 0; i--) {
			temp1 = value.multiply(new BigInteger("256", 10));
			temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
			value = temp2;
		}

		return value;
	}

function simpleHash(message) {
		_hash.init();
		_hash.update(message);
		return _hash.getBytes();
	}

function check(secretPhrase, accid)
{

	SHA256_init();
	SHA256_write(converters.stringToByteArray(secretPhrase));
	var ky = converters.byteArrayToHexString(curve25519.keygen(SHA256_finalize()).p);

	var hex = converters.hexStringToByteArray(ky);

		_hash.init();
		_hash.update(hex);

		var account = _hash.getBytes();

		account = converters.byteArrayToHexString(account);

		var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

		var accountId = byteArrayToBigInteger(slice).toString();
	if(accountId == accid) return true;
	else return false;
}
var epochNum = 1385294400;
function getPublicKey(secretPhrase)
{
	SHA256_init();
	SHA256_write(converters.stringToByteArray(secretPhrase));
	var ky = converters.byteArrayToHexString(curve25519.keygen(SHA256_finalize()).p);

	return converters.hexStringToByteArray(ky);
}

function toByteArray(long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

function signBytes (message, secretPhrase) {
		var messageBytes = message;
		var secretPhraseBytes = converters.stringToByteArray(secretPhrase);

		var digest = simpleHash(secretPhraseBytes);
		var s = curve25519.keygen(digest).s;

		var m = simpleHash(messageBytes);
		_hash.init();
		_hash.update(m);
		_hash.update(s);
		var x = _hash.getBytes();

		var y = curve25519.keygen(x).p;

		_hash.init();
		_hash.update(m);
		_hash.update(y);
		var h = _hash.getBytes();

		var v = curve25519.sign(h, x, s);


		return v.concat(h);
	}

function tokenize(websiteString, secretPhrase)
{
		//alert(converters.stringToHexString(websiteString));
		var hexwebsite = converters.stringToHexString(websiteString);
        var website = converters.hexStringToByteArray(hexwebsite);
        var data = [];
        data = website.concat(getPublicKey(secretPhrase));
        var unix = Math.round(+new Date()/1000);
        var timestamp = unix-epochNum;
        var timestamparray = toByteArray(timestamp);
        data = data.concat(timestamparray);

        var token = [];
        token = getPublicKey(secretPhrase).concat(timestamparray);

        var sig = signBytes(data, secretPhrase);

        token = token.concat(sig);
        var buf = "";

        for (var ptr = 0; ptr < 100; ptr += 5) {

        	var nbr = [];
        	nbr[0] = token[ptr] & 0xFF;
        	nbr[1] = token[ptr+1] & 0xFF;
        	nbr[2] = token[ptr+2] & 0xFF;
        	nbr[3] = token[ptr+3] & 0xFF;
        	nbr[4] = token[ptr+4] & 0xFF;
        	var number = byteArrayToBigInteger(nbr);

            if (number < 32) {
                buf+="0000000";
            } else if (number < 1024) {
                buf+="000000";
            } else if (number < 32768) {
                buf+="00000";
            } else if (number < 1048576) {
                buf+="0000";
            } else if (number < 33554432) {
                buf+="000";
            } else if (number < 1073741824) {
                buf+="00";
            } else if (number < 34359738368) {
                buf+="0";
            }
            buf +=number.toString(32);

        }
        return buf;

    }