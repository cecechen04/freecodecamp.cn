// test/bindings.test.js
const { expect } = require('chai');
const { performance } = require('perf_hooks');

// 安全替代函数
function stripTrailingHashes(url) {
  let i = url.length - 1;
  while (i >= 0 && url[i] === '#') i--;
  return url.slice(0, i + 1);
}

// 模拟原版逻辑（用于对比测试）
function originalReplace(url) {
  return url.replace(/#+$/, '');
}

describe('✅ stripTrailingHashes replacement test', function () {
  this.timeout(10000); // 最多允许10秒运行

  it('should match behavior of original regex for normal cases', () => {
    const cases = [
      ["https://a.com/page#", "https://a.com/page"],
      ["https://a.com/page###", "https://a.com/page"],
      ["https://a.com/page#section", "https://a.com/page#section"],
      ["https://a.com/page#section#", "https://a.com/page#section"],
      ["https://a.com/page", "https://a.com/page"],
    ];

    for (const [input, expected] of cases) {
      expect(stripTrailingHashes(input)).to.equal(expected);
      expect(stripTrailingHashes(input)).to.equal(originalReplace(input));
    }
  });

  it('should not hang on malicious long string input', () => {
    const attack = '#'.repeat(100000) + '@';
    const testUrl = 'https://a.com/' + attack;
    const t0 = performance.now();
    const result = stripTrailingHashes(testUrl);
    const t1 = performance.now();
    const duration = (t1 - t0) / 1000;
    console.log(`⏱️ safeReplace() 执行耗时：${duration.toFixed(3)} s`);
    expect(duration).to.be.lessThan(1); // 应该非常快（毫秒级）
  });
});