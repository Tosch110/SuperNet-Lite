/* 
    Arbitrary Precision Hex Converter
    Source : http://danvk.org/hex2dec.html
*/

var nsv_mgw_hexConverter = (function (nsv_mgw_hexConverter, $, undefined) {
    nsv_mgw_hexConverter.decToHex = function (decStr) {
        var hex = convertBase(decStr, 10, 16);
        return hex ? hex : null;
    }

    nsv_mgw_hexConverter.hexToDec = function (hexStr) {
        if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
        hexStr = hexStr.toLowerCase();
        return convertBase(hexStr, 16, 10);
    }
    
    nsv_mgw_padZero = function (hexStr,decimal) {
        var strZero = "";
        for (var x = hexStr.length; x < decimal; x++)
        {
            strZero += "0";
        }
        return strZero + hexStr;
    }

    nsv_mgw_reverseHex = function (hexStr) {
        var strNewStr = "";

        if (hexStr.length % 2 != 0) {
            hexStr = "0" + hexStr;
        }

        for (var x = hexStr.length; x > 0; x = x - 2) {
            strNewStr += hexStr.toString().substring(x - 2, x);
        }

        return strNewStr;
    }

    function add(x, y, base) {
        var z = [];
        var n = Math.max(x.length, y.length);
        var carry = 0;
        var i = 0;
        while (i < n || carry) {
            var xi = i < x.length ? x[i] : 0;
            var yi = i < y.length ? y[i] : 0;
            var zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    function multiplyByNumber(num, x, base) {
        if (num < 0) return null;
        if (num == 0) return [];

        var result = [];
        var power = x;
        while (true) {
            if (num & 1) {
                result = add(result, power, base);
            }
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }

    function parseToDigitsArray(str, base) {
        var digits = str.split('');
        var ary = [];
        for (var i = digits.length - 1; i >= 0; i--) {
            var n = parseInt(digits[i], base);
            if (isNaN(n)) return null;
            ary.push(n);
        }
        return ary;
    }

    function convertBase(str, fromBase, toBase) {
        var digits = parseToDigitsArray(str, fromBase);
        if (digits === null) return null;

        var outArray = [];
        var power = [1];
        for (var i = 0; i < digits.length; i++) {
            // invariant: at this point, fromBase^i = power
            if (digits[i]) {
                outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
            }
            power = multiplyByNumber(fromBase, power, toBase);
        }

        var out = '';
        for (var i = outArray.length - 1; i >= 0; i--) {
            out += outArray[i].toString(toBase);
        }
        return out;
    }
    
    return nsv_mgw_hexConverter;
}(nsv_mgw_hexConverter || {}, jQuery));