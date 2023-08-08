const path = require("path");
const fs = require("fs");

const requireRegex = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const importRegex = /(?:import|from) ['"]([^'"]*)['"]/g;

const rootPath = path.resolve("./dist");
const tsPath = "@/";

function scanPath (dir) {
  // 读取目录
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    // 遍历目录所有文件
    files.forEach((file) => {
      // 当前文件
      const curr = path.join(dir, file);
      const fileStat = fs.statSync(curr);
      if (fileStat.isFile()) {
        const extname = path.extname(curr);
        if (extname === ".js") {
          // 获取文件内容
          fs.readFile(curr, (readErr, data) => {
            if (readErr) throw readErr;
            const fileText = data.toString("utf8");
            // 替换匹配内容
            const newFileText = fileText
              .replace(requireRegex, (orig, matched) => {
                return replaceMatched(orig, matched, path.dirname(curr));
              })
              .replace(importRegex, (orig, matched) => {
                return replaceMatched(orig, matched, path.dirname(curr));
              });

            if (newFileText !== fileText) {
              // 回写文件
              // console.log("Replace ts paths: ", curr);
              fs.writeFile(curr, newFileText, (writeErr) => {
                if (writeErr) throw writeErr;
              });
            }
          });
        }
      } else if (fileStat.isDirectory()) {
        // 如果是目录继续递归
        scanPath(curr);
      }
    });
  });
}

function replaceMatched (orig, matched, filePath) {
  // console.log(matched);
  if (matched.indexOf(tsPath) === 0) {
    // 相对路径
    const relativePath =
      path.relative(filePath, rootPath).replace("\\", "/") + "/";
    return orig.replace(tsPath, relativePath);
  }
  return orig;
}

scanPath(rootPath);
