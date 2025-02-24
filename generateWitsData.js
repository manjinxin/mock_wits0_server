const fs = require("fs");

const num = 1000;

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return {
    datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    date: `${year}${month}${day}`,
    time: `${hours}${minutes}${seconds}`,
  };
}

function formatValue(value, prefix) {
  // 确保数值有正确的前缀和小数位数
  const numStr = Math.abs(value).toFixed(2);
  const sign = value < 0 ? "-" : "";
  return `${prefix}${sign}${numStr}`;
}

function generateWitsLine(baseTime, index) {
  const time = new Date(baseTime.getTime() + index * 5000); // 每5秒一条数据
  const { datetime, date, time: timeStr } = formatDateTime(time);

  // 基础值加上随机波动
  const randomFloat = (base, variance = 0.1) =>
    base + (Math.random() - 0.5) * variance;

  // 累计值缓慢增长
  const incrementalValue = (base, increment) => base + index * increment;

  return (
    `"&&,0101ZZ-A2,0104${datetime},0105${date},0106${timeStr},010739,` +
    `${formatValue(randomFloat(6707.1, 0.2), "0108")},` +
    `${formatValue(randomFloat(3729.12, 0.1), "0109")},` +
    `${formatValue(randomFloat(6708.15, 0.05), "0110")},` +
    `${formatValue(randomFloat(3729.53, 0.05), "0111")},` +
    `${formatValue(randomFloat(8.1, 0.2), "0112")},` +
    `01130,` +
    `${formatValue(randomFloat(134.68, 0.5), "0114")},` +
    `${formatValue(randomFloat(0.31, 0.1), "0116")},` +
    `${formatValue(randomFloat(0.31, 0.1), "0117")},` +
    `${formatValue(randomFloat(49.54, 0.5), "0118")},` +
    `01190,0120120,` +
    `${formatValue(incrementalValue(26242.33, 0.5), "0121")},` +
    `01230,` +
    `${formatValue(randomFloat(52, 1), "0124")},` +
    `${formatValue(randomFloat(57, 0.5), "0125")},` +
    `${formatValue(randomFloat(164.61, 0.1), "0126")},` +
    `${formatValue(randomFloat(-20.36, 0.1), "0127")},` +
    `012845,` +
    `${formatValue(incrementalValue(1709.99, 0.05), "0130")},` +
    `01311300,01321300,013353,013450,` +
    `${formatValue(randomFloat(5145.11, 50), "0135")},` +
    `${formatValue(randomFloat(4750, 50), "0136")},` +
    `${formatValue(incrementalValue(86589, 1), "0137")},` +
    `${formatValue(randomFloat(10113, 1), "0138")},` +
    `${formatValue(randomFloat(6706.36, 0.1), "0139")},` +
    `${formatValue(randomFloat(3.49, 0.1), "0140")},` +
    `${formatValue(randomFloat(82115.99, 0.1), "0141")},` +
    `${formatValue(randomFloat(5507.46, 10), "0142")},` +
    `0143196.3,01440,!!"`
  );
}

// 生成num条数据
const baseTime = new Date("2023-09-25T08:38:30");
const newData = Array.from({ length: num }, (_, i) =>
  generateWitsLine(baseTime, i)
);

// 读取现有文件
const currentFile = fs.readFileSync("sample_data.js", "utf8");

// 修改插入方式
const updatedContent = currentFile.replace(
  "];",
  ",\n    " + newData.join(",\n    ") + "\n];"
);

// 写入文件
fs.writeFileSync("sample_data.js", updatedContent, "utf8");

console.log("Successfully generated " + num + " new WITS data records!");
