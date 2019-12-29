const FTP = require('./ftp');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');


/**
 * 日志对象
 *
 */
function log() {}
log.info = function info(...args) {
  console.log(chalk.bgCyan.whiteBright(' DEPLOY INFO: '), ...args);
};
log.warn = function info(...args) {
  console.log(chalk.bgYellow.whiteBright(' DEPLOY WARN: '), ...args);
};
log.error = function info(...args) {
  console.log(chalk.bgRed.whiteBright(' DEPLOY WARN: '), ...args);
};


const SOURCE_DIR = path.resolve(__dirname, '../../dist');
const SOURCE_BASE_PATH = './';
const TARGET_BASE_PATH = '/website/gofrontend/';

/**
 * 获取文件上传的映射关系
 *
 * @param {*} filesList
 * @returns { [dest]: src }
 */
function getUploadMap(filesList) {
  const curPath = path.resolve(SOURCE_BASE_PATH);
  const map = {};
  filesList.forEach(fullPath => {
    const relativeSourcePath = fullPath.replace(curPath, '.');
    map[path.join(TARGET_BASE_PATH, relativeSourcePath)] = relativeSourcePath;
  });
  return map;
}

/**
 * 读取文件夹下的所有文件路径
 *
 * @param {*} dir
 * @returns
 */
function readFileList(dir) {
  function readFile(curDir, filesList = []) {
    const files = fs.readdirSync(curDir);
    files.forEach(item => {
      const fullPath = path.join(curDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFile(path.join(curDir, item), filesList); //递归读取文件
      } else {
        filesList.push(fullPath);
      }
    });
    return filesList;
  }
  return readFile(dir);
}

/**
 * 发布任务
 *
 */
function deploy() {
  const uploadMap = getUploadMap(readFileList(SOURCE_DIR));

  const basePath = '/';
  const [host, port, username, password] = process.argv.splice(2);

  if (!host || !port || !username || !password) {
    log.warn('缺少必要参数!! 正确例子: npm run deploy ${host} ${port} ${username} ${password}');
    return;
  }

  const ftp = new FTP({
    host,
    port,
    username,
    password,
    basePath,
  });
  ftp
    .init()
    .then(() => ftp.put(uploadMap))
    .then(() => ftp.close());
}

deploy();
