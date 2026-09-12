// @ts-nocheck

/*! zcash-payment-request-widget.embed.v2.js | (c) PayWithZcash Widget | Dual-mode: auto + programmatic */
(async function () {

  // ---------- Vendored QR code generator (100% client-side; no network call) ----------
  // This file is a dependency-free static script loaded via a single <script src>
  // tag on third-party sites (no bundler in the loop), so QR generation must not
  // depend on a server request (payment privacy) or a runtime CDN import. The code
  // below is copied, unmodified in logic, from qrcode.react v3.2.0
  // (https://www.npmjs.com/package/qrcode.react), already a dependency of this
  // project (see package.json), which itself vendors Project Nayuki's QR Code
  // generator library. Original license notices are preserved below.

  /**
   * @license QR Code generator library (TypeScript)
   * Copyright (c) Project Nayuki.
   * SPDX-License-Identifier: MIT
   */
  var qrcodegen;
  ((qrcodegen2) => {
    const _QrCode = class {
      constructor(version, errorCorrectionLevel, dataCodewords, msk) {
        this.version = version;
        this.errorCorrectionLevel = errorCorrectionLevel;
        this.modules = [];
        this.isFunction = [];
        if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION)
          throw new RangeError("Version value out of range");
        if (msk < -1 || msk > 7)
          throw new RangeError("Mask value out of range");
        this.size = version * 4 + 17;
        let row = [];
        for (let i = 0; i < this.size; i++)
          row.push(false);
        for (let i = 0; i < this.size; i++) {
          this.modules.push(row.slice());
          this.isFunction.push(row.slice());
        }
        this.drawFunctionPatterns();
        const allCodewords = this.addEccAndInterleave(dataCodewords);
        this.drawCodewords(allCodewords);
        if (msk == -1) {
          let minPenalty = 1e9;
          for (let i = 0; i < 8; i++) {
            this.applyMask(i);
            this.drawFormatBits(i);
            const penalty = this.getPenaltyScore();
            if (penalty < minPenalty) {
              msk = i;
              minPenalty = penalty;
            }
            this.applyMask(i);
          }
        }
        assert(0 <= msk && msk <= 7);
        this.mask = msk;
        this.applyMask(msk);
        this.drawFormatBits(msk);
        this.isFunction = [];
      }
      static encodeText(text, ecl) {
        const segs = qrcodegen2.QrSegment.makeSegments(text);
        return _QrCode.encodeSegments(segs, ecl);
      }
      static encodeBinary(data, ecl) {
        const seg = qrcodegen2.QrSegment.makeBytes(data);
        return _QrCode.encodeSegments([seg], ecl);
      }
      static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
        if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7)
          throw new RangeError("Invalid value");
        let version;
        let dataUsedBits;
        for (version = minVersion; ; version++) {
          const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
          const usedBits = QrSegment.getTotalBits(segs, version);
          if (usedBits <= dataCapacityBits2) {
            dataUsedBits = usedBits;
            break;
          }
          if (version >= maxVersion)
            throw new RangeError("Data too long");
        }
        for (const newEcl of [_QrCode.Ecc.MEDIUM, _QrCode.Ecc.QUARTILE, _QrCode.Ecc.HIGH]) {
          if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8)
            ecl = newEcl;
        }
        let bb = [];
        for (const seg of segs) {
          appendBits(seg.mode.modeBits, 4, bb);
          appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
          for (const b of seg.getData())
            bb.push(b);
        }
        assert(bb.length == dataUsedBits);
        const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
        assert(bb.length <= dataCapacityBits);
        appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
        appendBits(0, (8 - bb.length % 8) % 8, bb);
        assert(bb.length % 8 == 0);
        for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)
          appendBits(padByte, 8, bb);
        let dataCodewords = [];
        while (dataCodewords.length * 8 < bb.length)
          dataCodewords.push(0);
        bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
        return new _QrCode(version, ecl, dataCodewords, mask);
      }
      getModule(x, y) {
        return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
      }
      getModules() {
        return this.modules;
      }
      drawFunctionPatterns() {
        for (let i = 0; i < this.size; i++) {
          this.setFunctionModule(6, i, i % 2 == 0);
          this.setFunctionModule(i, 6, i % 2 == 0);
        }
        this.drawFinderPattern(3, 3);
        this.drawFinderPattern(this.size - 4, 3);
        this.drawFinderPattern(3, this.size - 4);
        const alignPatPos = this.getAlignmentPatternPositions();
        const numAlign = alignPatPos.length;
        for (let i = 0; i < numAlign; i++) {
          for (let j = 0; j < numAlign; j++) {
            if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0))
              this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
          }
        }
        this.drawFormatBits(0);
        this.drawVersion();
      }
      drawFormatBits(mask) {
        const data = this.errorCorrectionLevel.formatBits << 3 | mask;
        let rem = data;
        for (let i = 0; i < 10; i++)
          rem = rem << 1 ^ (rem >>> 9) * 1335;
        const bits = (data << 10 | rem) ^ 21522;
        assert(bits >>> 15 == 0);
        for (let i = 0; i <= 5; i++)
          this.setFunctionModule(8, i, getBit(bits, i));
        this.setFunctionModule(8, 7, getBit(bits, 6));
        this.setFunctionModule(8, 8, getBit(bits, 7));
        this.setFunctionModule(7, 8, getBit(bits, 8));
        for (let i = 9; i < 15; i++)
          this.setFunctionModule(14 - i, 8, getBit(bits, i));
        for (let i = 0; i < 8; i++)
          this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
        for (let i = 8; i < 15; i++)
          this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
        this.setFunctionModule(8, this.size - 8, true);
      }
      drawVersion() {
        if (this.version < 7)
          return;
        let rem = this.version;
        for (let i = 0; i < 12; i++)
          rem = rem << 1 ^ (rem >>> 11) * 7973;
        const bits = this.version << 12 | rem;
        assert(bits >>> 18 == 0);
        for (let i = 0; i < 18; i++) {
          const color = getBit(bits, i);
          const a = this.size - 11 + i % 3;
          const b = Math.floor(i / 3);
          this.setFunctionModule(a, b, color);
          this.setFunctionModule(b, a, color);
        }
      }
      drawFinderPattern(x, y) {
        for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            const xx = x + dx;
            const yy = y + dy;
            if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
              this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
          }
        }
      }
      drawAlignmentPattern(x, y) {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++)
            this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
        }
      }
      setFunctionModule(x, y, isDark) {
        this.modules[y][x] = isDark;
        this.isFunction[y][x] = true;
      }
      addEccAndInterleave(data) {
        const ver = this.version;
        const ecl = this.errorCorrectionLevel;
        if (data.length != _QrCode.getNumDataCodewords(ver, ecl))
          throw new RangeError("Invalid argument");
        const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
        const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
        const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
        const numShortBlocks = numBlocks - rawCodewords % numBlocks;
        const shortBlockLen = Math.floor(rawCodewords / numBlocks);
        let blocks = [];
        const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);
        for (let i = 0, k = 0; i < numBlocks; i++) {
          let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
          k += dat.length;
          const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);
          if (i < numShortBlocks)
            dat.push(0);
          blocks.push(dat.concat(ecc));
        }
        let result = [];
        for (let i = 0; i < blocks[0].length; i++) {
          blocks.forEach((block, j) => {
            if (i != shortBlockLen - blockEccLen || j >= numShortBlocks)
              result.push(block[i]);
          });
        }
        assert(result.length == rawCodewords);
        return result;
      }
      drawCodewords(data) {
        if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8))
          throw new RangeError("Invalid argument");
        let i = 0;
        for (let right = this.size - 1; right >= 1; right -= 2) {
          if (right == 6)
            right = 5;
          for (let vert = 0; vert < this.size; vert++) {
            for (let j = 0; j < 2; j++) {
              const x = right - j;
              const upward = (right + 1 & 2) == 0;
              const y = upward ? this.size - 1 - vert : vert;
              if (!this.isFunction[y][x] && i < data.length * 8) {
                this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
                i++;
              }
            }
          }
        }
        assert(i == data.length * 8);
      }
      applyMask(mask) {
        if (mask < 0 || mask > 7)
          throw new RangeError("Mask value out of range");
        for (let y = 0; y < this.size; y++) {
          for (let x = 0; x < this.size; x++) {
            let invert;
            switch (mask) {
              case 0:
                invert = (x + y) % 2 == 0;
                break;
              case 1:
                invert = y % 2 == 0;
                break;
              case 2:
                invert = x % 3 == 0;
                break;
              case 3:
                invert = (x + y) % 3 == 0;
                break;
              case 4:
                invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
                break;
              case 5:
                invert = x * y % 2 + x * y % 3 == 0;
                break;
              case 6:
                invert = (x * y % 2 + x * y % 3) % 2 == 0;
                break;
              case 7:
                invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
                break;
              default:
                throw new Error("Unreachable");
            }
            if (!this.isFunction[y][x] && invert)
              this.modules[y][x] = !this.modules[y][x];
          }
        }
      }
      getPenaltyScore() {
        let result = 0;
        for (let y = 0; y < this.size; y++) {
          let runColor = false;
          let runX = 0;
          let runHistory = [0, 0, 0, 0, 0, 0, 0];
          for (let x = 0; x < this.size; x++) {
            if (this.modules[y][x] == runColor) {
              runX++;
              if (runX == 5)
                result += _QrCode.PENALTY_N1;
              else if (runX > 5)
                result++;
            } else {
              this.finderPenaltyAddHistory(runX, runHistory);
              if (!runColor)
                result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
              runColor = this.modules[y][x];
              runX = 1;
            }
          }
          result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
        }
        for (let x = 0; x < this.size; x++) {
          let runColor = false;
          let runY = 0;
          let runHistory = [0, 0, 0, 0, 0, 0, 0];
          for (let y = 0; y < this.size; y++) {
            if (this.modules[y][x] == runColor) {
              runY++;
              if (runY == 5)
                result += _QrCode.PENALTY_N1;
              else if (runY > 5)
                result++;
            } else {
              this.finderPenaltyAddHistory(runY, runHistory);
              if (!runColor)
                result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
              runColor = this.modules[y][x];
              runY = 1;
            }
          }
          result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
        }
        for (let y = 0; y < this.size - 1; y++) {
          for (let x = 0; x < this.size - 1; x++) {
            const color = this.modules[y][x];
            if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1])
              result += _QrCode.PENALTY_N2;
          }
        }
        let dark = 0;
        for (const row of this.modules)
          dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
        const total = this.size * this.size;
        const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
        assert(0 <= k && k <= 9);
        result += k * _QrCode.PENALTY_N4;
        assert(0 <= result && result <= 2568888);
        return result;
      }
      getAlignmentPatternPositions() {
        if (this.version == 1)
          return [];
        else {
          const numAlign = Math.floor(this.version / 7) + 2;
          const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
          let result = [6];
          for (let pos = this.size - 7; result.length < numAlign; pos -= step)
            result.splice(1, 0, pos);
          return result;
        }
      }
      static getNumRawDataModules(ver) {
        if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION)
          throw new RangeError("Version number out of range");
        let result = (16 * ver + 128) * ver + 64;
        if (ver >= 2) {
          const numAlign = Math.floor(ver / 7) + 2;
          result -= (25 * numAlign - 10) * numAlign - 55;
          if (ver >= 7)
            result -= 36;
        }
        assert(208 <= result && result <= 29648);
        return result;
      }
      static getNumDataCodewords(ver, ecl) {
        return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
      }
      static reedSolomonComputeDivisor(degree) {
        if (degree < 1 || degree > 255)
          throw new RangeError("Degree out of range");
        let result = [];
        for (let i = 0; i < degree - 1; i++)
          result.push(0);
        result.push(1);
        let root = 1;
        for (let i = 0; i < degree; i++) {
          for (let j = 0; j < result.length; j++) {
            result[j] = _QrCode.reedSolomonMultiply(result[j], root);
            if (j + 1 < result.length)
              result[j] ^= result[j + 1];
          }
          root = _QrCode.reedSolomonMultiply(root, 2);
        }
        return result;
      }
      static reedSolomonComputeRemainder(data, divisor) {
        let result = divisor.map((_) => 0);
        for (const b of data) {
          const factor = b ^ result.shift();
          result.push(0);
          divisor.forEach((coef, i) => result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
        }
        return result;
      }
      static reedSolomonMultiply(x, y) {
        if (x >>> 8 != 0 || y >>> 8 != 0)
          throw new RangeError("Byte out of range");
        let z = 0;
        for (let i = 7; i >= 0; i--) {
          z = z << 1 ^ (z >>> 7) * 285;
          z ^= (y >>> i & 1) * x;
        }
        assert(z >>> 8 == 0);
        return z;
      }
      finderPenaltyCountPatterns(runHistory) {
        const n = runHistory[1];
        assert(n <= this.size * 3);
        const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
        return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
      }
      finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
        if (currentRunColor) {
          this.finderPenaltyAddHistory(currentRunLength, runHistory);
          currentRunLength = 0;
        }
        currentRunLength += this.size;
        this.finderPenaltyAddHistory(currentRunLength, runHistory);
        return this.finderPenaltyCountPatterns(runHistory);
      }
      finderPenaltyAddHistory(currentRunLength, runHistory) {
        if (runHistory[0] == 0)
          currentRunLength += this.size;
        runHistory.pop();
        runHistory.unshift(currentRunLength);
      }
    };
    let QrCode = _QrCode;
    QrCode.MIN_VERSION = 1;
    QrCode.MAX_VERSION = 40;
    QrCode.PENALTY_N1 = 3;
    QrCode.PENALTY_N2 = 3;
    QrCode.PENALTY_N3 = 40;
    QrCode.PENALTY_N4 = 10;
    QrCode.ECC_CODEWORDS_PER_BLOCK = [
      [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
      [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    ];
    QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
      [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
      [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
      [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
      [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
    ];
    qrcodegen2.QrCode = QrCode;
    function appendBits(val, len, bb) {
      if (len < 0 || len > 31 || val >>> len != 0)
        throw new RangeError("Value out of range");
      for (let i = len - 1; i >= 0; i--)
        bb.push(val >>> i & 1);
    }
    function getBit(x, i) {
      return (x >>> i & 1) != 0;
    }
    function assert(cond) {
      if (!cond)
        throw new Error("Assertion error");
    }
    const _QrSegment = class {
      constructor(mode, numChars, bitData) {
        this.mode = mode;
        this.numChars = numChars;
        this.bitData = bitData;
        if (numChars < 0)
          throw new RangeError("Invalid argument");
        this.bitData = bitData.slice();
      }
      static makeBytes(data) {
        let bb = [];
        for (const b of data)
          appendBits(b, 8, bb);
        return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
      }
      static makeNumeric(digits) {
        if (!_QrSegment.isNumeric(digits))
          throw new RangeError("String contains non-numeric characters");
        let bb = [];
        for (let i = 0; i < digits.length; ) {
          const n = Math.min(digits.length - i, 3);
          appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
          i += n;
        }
        return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
      }
      static makeAlphanumeric(text) {
        if (!_QrSegment.isAlphanumeric(text))
          throw new RangeError("String contains unencodable characters in alphanumeric mode");
        let bb = [];
        let i;
        for (i = 0; i + 2 <= text.length; i += 2) {
          let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
          temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
          appendBits(temp, 11, bb);
        }
        if (i < text.length)
          appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
        return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
      }
      static makeSegments(text) {
        if (text == "")
          return [];
        else if (_QrSegment.isNumeric(text))
          return [_QrSegment.makeNumeric(text)];
        else if (_QrSegment.isAlphanumeric(text))
          return [_QrSegment.makeAlphanumeric(text)];
        else
          return [_QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))];
      }
      static makeEci(assignVal) {
        let bb = [];
        if (assignVal < 0)
          throw new RangeError("ECI assignment value out of range");
        else if (assignVal < 1 << 7)
          appendBits(assignVal, 8, bb);
        else if (assignVal < 1 << 14) {
          appendBits(2, 2, bb);
          appendBits(assignVal, 14, bb);
        } else if (assignVal < 1e6) {
          appendBits(6, 3, bb);
          appendBits(assignVal, 21, bb);
        } else
          throw new RangeError("ECI assignment value out of range");
        return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
      }
      static isNumeric(text) {
        return _QrSegment.NUMERIC_REGEX.test(text);
      }
      static isAlphanumeric(text) {
        return _QrSegment.ALPHANUMERIC_REGEX.test(text);
      }
      getData() {
        return this.bitData.slice();
      }
      static getTotalBits(segs, version) {
        let result = 0;
        for (const seg of segs) {
          const ccbits = seg.mode.numCharCountBits(version);
          if (seg.numChars >= 1 << ccbits)
            return Infinity;
          result += 4 + ccbits + seg.bitData.length;
        }
        return result;
      }
      static toUtf8ByteArray(str) {
        str = encodeURI(str);
        let result = [];
        for (let i = 0; i < str.length; i++) {
          if (str.charAt(i) != "%")
            result.push(str.charCodeAt(i));
          else {
            result.push(parseInt(str.substr(i + 1, 2), 16));
            i += 2;
          }
        }
        return result;
      }
    };
    let QrSegment = _QrSegment;
    QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
    QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
    QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
    qrcodegen2.QrSegment = QrSegment;
  })(qrcodegen || (qrcodegen = {}));
  ((qrcodegen2) => {
    let QrCode;
    ((QrCode2) => {
      const _Ecc = class {
        constructor(ordinal, formatBits) {
          this.ordinal = ordinal;
          this.formatBits = formatBits;
        }
      };
      let Ecc = _Ecc;
      Ecc.LOW = new _Ecc(0, 1);
      Ecc.MEDIUM = new _Ecc(1, 0);
      Ecc.QUARTILE = new _Ecc(2, 3);
      Ecc.HIGH = new _Ecc(3, 2);
      QrCode2.Ecc = Ecc;
    })(QrCode = qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
  })(qrcodegen || (qrcodegen = {}));
  ((qrcodegen2) => {
    let QrSegment;
    ((QrSegment2) => {
      const _Mode = class {
        constructor(modeBits, numBitsCharCount) {
          this.modeBits = modeBits;
          this.numBitsCharCount = numBitsCharCount;
        }
        numCharCountBits(ver) {
          return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
        }
      };
      let Mode = _Mode;
      Mode.NUMERIC = new _Mode(1, [10, 12, 14]);
      Mode.ALPHANUMERIC = new _Mode(2, [9, 11, 13]);
      Mode.BYTE = new _Mode(4, [8, 16, 16]);
      Mode.KANJI = new _Mode(8, [8, 10, 12]);
      Mode.ECI = new _Mode(7, [0, 0, 0]);
      QrSegment2.Mode = Mode;
    })(QrSegment = qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
  })(qrcodegen || (qrcodegen = {}));

  /**
   * @license qrcode.react
   * Copyright (c) Paul O'Shannessy
   * SPDX-License-Identifier: ISC
   */
  function generatePath(modules, margin = 0) {
    const ops = [];
    modules.forEach(function(row, y) {
      let start = null;
      row.forEach(function(cell, x) {
        if (!cell && start !== null) {
          ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
          start = null;
          return;
        }
        if (x === row.length - 1) {
          if (!cell) {
            return;
          }
          if (start === null) {
            ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
          } else {
            ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
          }
          return;
        }
        if (cell && start === null) {
          start = x;
        }
      });
    });
    return ops.join("");
  }

  function renderZip321QrDataUrl(text) {
    const modules = qrcodegen.QrCode.encodeText(
      text,
      qrcodegen.QrCode.Ecc.MEDIUM,
    ).getModules();
    const margin = 4;
    const numCells = modules.length + margin * 2;
    const size = 240;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const scale = size / numCells;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, numCells, numCells);
    ctx.fillStyle = "#000000";

    if (typeof Path2D !== "undefined") {
      ctx.fill(new Path2D(generatePath(modules, margin)));
    } else {
      modules.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) ctx.fillRect(x + margin, y + margin, 1, 1);
        });
      });
    }

    return canvas.toDataURL("image/png");
  }
  // ---------- End vendored QR code generator ----------

  // ---------- Configuration ----------
  const DEFAULT_API_BASE =
    typeof window !== "undefined" &&
    window.ZPWZ_CONFIG &&
    window.ZPWZ_CONFIG.apiBase
      ? window.ZPWZ_CONFIG.apiBase
      : "";

  // Load CSS (your original CSS preserved exactly)
  const style = document.createElement("style");
  style.textContent = `
    .zwg-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,#F4B728 0%,#E5A420 100%);color:#1a1a1a;font:600 15px/1 system-ui,-apple-system,sans-serif;border:0;border-radius:14px;cursor:pointer;box-shadow:0 4px 24px -4px rgba(244,183,40,0.5),inset 0 1px 0 rgba(255,255,255,0.3);transition:all .2s ease;overflow:hidden}
    .zwg-btn:active{transform:translateY(0) scale(.98)}
    .zwg-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-100%);transition:transform .6s}
    .zwg-btn svg{width:18px;height:18px}
    .zwg-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;animation:zwg-fade .25s ease}
    @keyframes zwg-fade{from{opacity:0}to{opacity:1}}
    .zwg-modal{width:100%;max-width:400px;background:var(--zwg-bg);color:var(--zwg-text);border-radius:28px;padding:28px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 32px 64px -16px rgba(0,0,0,.4),0 0 0 1px var(--zwg-border);animation:zwg-pop .35s cubic-bezier(.16,1,.3,1);position:relative}
    @keyframes zwg-pop{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .zwg-light{--zwg-bg:#fff;--zwg-text:#111;--zwg-muted:#6b7280;--zwg-surface:#f3f4f6;--zwg-border:rgba(0,0,0,.08)}
    .zwg-dark{--zwg-bg:#18181b;--zwg-text:#fafafa;--zwg-muted:#a1a1aa;--zwg-surface:#27272a;--zwg-border:rgba(255,255,255,.1)}
    .zwg-head{text-align:center;margin-bottom:24px}
    .zwg-icon{width:56px;height:56px;margin:0 auto 14px;background:linear-gradient(145deg,#F4B728,#D4940F);border-radius:16px;display:flex;align-items:center;justify-content:center;font:700 24px/1 system-ui;color:#1a1a1a;box-shadow:0 8px 20px -6px rgba(244,183,40,.5)}
    .zwg-title{margin:0 0 4px;font:700 22px/1.2 system-ui}
    .zwg-label{margin:0;font-size:13px;color:var(--zwg-muted)}
    .zwg-qr{background:#fff;border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}
    .zwg-qr img{display:block;width:180px;height:180px;margin:0 auto;border-radius:12px}
    .zwg-amt{background:var(--zwg-surface);border-radius:16px;padding:16px;text-align:center;margin-bottom:16px}
    .zwg-amt-lbl{margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-amt-val{margin:0;font:700 32px/1.2 system-ui}
    .zwg-amt-val b{color:#F4B728}
    .zwg-amt-val small{font-size:16px;color:var(--zwg-muted);margin-left:6px;font-weight:500}
    .zwg-fld{margin-bottom:14px}
    .zwg-fld-lbl{display:block;margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-fld-row{display:flex;align-items:center;gap:8px;background:var(--zwg-surface);border-radius:12px;padding:10px 12px}
    .zwg-fld-txt{flex:1;margin:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;word-break:break-all;color:var(--zwg-text)}
    .zwg-fld-inp{flex:1;background:0;border:0;outline:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;color:var(--zwg-text);width:100%}
    .zwg-memo{background:var(--zwg-surface);border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;color:var(--zwg-text)}
    .zwg-copy{flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:8px;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-copy:hover{background:var(--zwg-bg);color:var(--zwg-text)}
    .zwg-copy.ok{background:rgba(34,197,94,.15);color:#22c55e}
    .zwg-copy svg{width:14px;height:14px}
    .zwg-acts{display:flex;gap:10px;margin-top:20px}
    .zwg-btn2{flex:1;padding:14px;font:600 13px/1 system-ui;border:0;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
    .zwg-btn2 svg{width:14px;height:14px}
    .zwg-sec{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-sec:hover{filter:brightness(1.05)}
    .zwg-pri{background:linear-gradient(135deg,#F4B728,#E5A420);color:#1a1a1a}
    .zwg-pri:hover{box-shadow:0 6px 20px -4px rgba(244,183,40,.5);transform:translateY(-1px)}
    .zwg-pri:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .zwg-spin{width:14px;height:14px;border:2px solid rgba(26,26,26,.2);border-top-color:#1a1a1a;border-radius:50%;animation:zwg-sp .7s linear infinite}
    @keyframes zwg-sp{to{transform:rotate(360deg)}}
    .zwg-link{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:14px;font-size:13px;color:var(--zwg-muted);text-decoration:none;transition:color .15s}
    .zwg-link:hover{color:var(--zwg-text)}
    .zwg-link svg{width:14px;height:14px}
    .zwg-x{position:absolute;top:14px;right:14px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:50%;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-x:hover{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-x svg{width:16px;height:16px}
    .zwg-disabled{opacity:0.5;cursor:none;}
    .zwg-footer{display:flex;justify-content:center;margin-top:24px;font-size:12px;text-align:center;opacity:0.7;}
    @media(max-width:480px){.zwg-modal{padding:22px;border-radius:24px}.zwg-acts{flex-direction:column}}
  `;
  document.head.appendChild(style);

  // Icons
  const ic = {
    z: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 15h8M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    cp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
    ok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    lnk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    ext: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`,
  };

  async function getZecUsdRate(zecUsdRate, apiBase) {
    const url = `${apiBase}/payment-request-uri/zcash-price-feed`;

    if (zecUsdRate != null) return zecUsdRate;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const rate = data.rate ?? data.price ?? data?.data?.rate ?? null;

      return rate;
    } catch (err) {
      console.error("Failed to fetch rate", err);
      return null;
    }
  }

  // ------------------------------
  //   MAIN RENDER FUNCTION
  // ------------------------------

  async function renderZcashButton(selector, opts) {
    const container = document.querySelector(selector);

    if (!container) {
      console.error(
        `[Zcash-Payment-URI-Widget] Container not found for selector: ${selector}`,
      );
      return null;
    }

    const address = opts.address;
    const amount = opts.amount;
    const label = opts.label || "Pay with Zcash";
    const theme = opts.theme || "light";
    const memo = opts.memo || "";
    const apiBase = opts.apiBase || DEFAULT_API_BASE;
    const isDisabled = opts.disabled === true || opts.disabled === "true";

    const zecUsdRate =
      opts.zecUsdRate != null
        ? opts.zecUsdRate
        : await getZecUsdRate(opts.zecUsdRate, apiBase);

    const usdValue =
      zecUsdRate && !isNaN(zecUsdRate)
        ? (amount * Number(zecUsdRate)).toFixed(2)
        : null;

    if (!address || !amount) {
      console.error(
        "[Zcash-Payment-URI-Widget] Missing required fields: address or amount.",
      );
      return null;
    }

    // Create trigger button
    const btn = document.createElement("button");
    btn.className = "zwg-btn";
    btn.innerHTML = `${ic.z}<span>${label}</span>`;
    container.appendChild(btn);

    if (isDisabled) {
      btn.classList.add("zwg-disabled");
      btn.style.opacity = "0.5";
      btn.style.pointerEvents = "none";

      return;
    }

    // Create modal overlay (hidden initially)
    let overlay = null;

    function open() {
      if (overlay) return;

      const uri = `zcash:${address}?amount=${amount}${
        memo ? `&memo=${encodeURIComponent(memo)}` : ""
      }`;
      const qrDataUrl = renderZip321QrDataUrl(uri);

      overlay = document.createElement("div");
      overlay.className = "zwg-overlay";

      const cls = theme === "dark" ? "zwg-dark" : "zwg-light";

      overlay.innerHTML = `
        <div class="zwg-modal ${cls}">
          <button class="zwg-x" aria-label="Close">${ic.x}</button>
          <div class="zwg-head">
            <div class="zwg-icon">Z</div>
            ${label ? `<h2 class="zwg-title">${label}</h2>` : "Pay with Zcash"}
          </div>

          <div class="zwg-qr">
             <img src="${qrDataUrl}" alt="QR Code "/>
          </div>

          <div class="zwg-amt">
            <p class="zwg-amt-lbl">Amount Due</p>
            <p class="zwg-amt-val"><b>${Number(amount).toFixed(3)}</b><small>ZEC</small></p>${
              usdValue
                ? `<p style="margin-top:4px;font-size:12px;font-style:italic;color:var(--zwg-muted)">
         ≈ $${usdValue} USD
       </p>`
                : ""
            }
          </div>

          <div class="zwg-fld">
            <span class="zwg-fld-lbl">Address</span>
            <div class="zwg-fld-row">
              <p class="zwg-fld-txt">${address}</p>
              <button class="zwg-copy" data-c="${address}">${ic.cp}</button>
            </div>
          </div>

          ${
            memo
              ? `<div class="zwg-fld">
                   <span class="zwg-fld-lbl">Memo</span>
                   <div class="zwg-memo">${memo}</div>
                 </div>`
              : ""
          }

          <div class="zwg-fld">
            <span class="zwg-fld-lbl">Payment URI</span>
            <div class="zwg-fld-row">
              <input class="zwg-fld-inp" value="${uri}" readonly />
              <button class="zwg-copy" data-c="${uri}">${ic.cp}</button>
            </div>
          </div>

          <div class="zwg-acts">
            <button class="zwg-btn2 zwg-sec zwg-close">Close</button>
            <button class="zwg-btn2 zwg-pri zwg-short">${ic.lnk} Short URL</button>
          </div>

          <a href="${uri}" class="zwg-link">${ic.ext} Open in Wallet</a>
          <footer class="zwg-footer"> ${new Date().getFullYear()} Pay with Zcash</footer>
        </div>

      `;

      document.body.appendChild(overlay);

      overlay.onclick = (e) => e.target === overlay && close();
      overlay.querySelector(".zwg-x").onclick = close;
      overlay.querySelector(".zwg-close").onclick = close;

      overlay.querySelectorAll(".zwg-copy").forEach((b) => {
        b.onclick = async () => {
          try {
            await navigator.clipboard.writeText(b.dataset.c);
            b.classList.add("ok");
            b.innerHTML = ic.ok;
            setTimeout(() => {
              b.classList.remove("ok");
              b.innerHTML = ic.cp;
            }, 1500);
          } catch {}
        };
      });

      const shortBtn = overlay.querySelector(".zwg-short");
      shortBtn.onclick = async () => {
        shortBtn.disabled = true;
        shortBtn.innerHTML = `<span class="zwg-spin"></span>`;

        try {
          const res = await fetch(`${apiBase}/payment-request-uri/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uri }),
          });

          const { shortUrl } = await res.json();
          shortBtn.innerHTML = `${ic.ok} Done`;

          const fld = document.createElement("div");
          fld.className = "zwg-fld";
          fld.innerHTML = `
            <span class="zwg-fld-lbl">Short URL</span>
            <div class="zwg-fld-row">
              <input class="zwg-fld-inp" value="${shortUrl}" readonly />
              <button class="zwg-copy" data-c="${shortUrl}">${ic.cp}</button>
            </div>
          `;

          overlay.querySelector(".zwg-acts").before(fld);

          fld.querySelector(".zwg-copy").onclick = async function () {
            try {
              await navigator.clipboard.writeText(shortUrl);
              this.classList.add("ok");
              this.innerHTML = ic.ok;
              setTimeout(() => {
                this.classList.remove("ok");
                this.innerHTML = ic.cp;
              }, 1500);
            } catch {}
          };
        } catch (err) {
          shortBtn.innerHTML = `${ic.lnk} Retry`;
          shortBtn.disabled = false;
          console.error(err);
        }
      };
    }

    function close() {
      if (!overlay) return;
      overlay.remove();
      overlay = null;
    }

    function destroy() {
      close();
      btn.remove();
    }

    btn.onclick = open;

    return { open, close, destroy };
  }

  // Expose globally
  window.renderZcashButton = renderZcashButton;

  // ------------------------------
  //   AUTO-MOUNT HANDLING
  // ------------------------------
  const script = document.currentScript;

  if (
    script &&
    script.dataset &&
    script.dataset.target &&
    script.dataset.address &&
    script.dataset.amount
  ) {
    const target = script.dataset.target;

    const inst = renderZcashButton(target, {
      address: script.dataset.address,
      amount: script.dataset.amount,
      zecUsdRate: zecUsdRate || script.dataset.zecUsdRate,
      label: script.dataset.label,
      theme: script.dataset.theme,
      memo: script.dataset.memo,
      apiBase: script.dataset.apiBase || DEFAULT_API_BASE,
      disabled: script.dataset.disabled,
    });

    window.__zcash_paymet_uri_widget_autoinstance = inst;
  }
})();
