const FTPClient = require('ftp');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

/**
 * 日志对象
 *
 */
function log() {}
log.info = function info(...args) {
  console.log(chalk.bgCyan.whiteBright(' FTP INFO: '), ...args);
};
log.warn = function info(...args) {
  console.log(chalk.bgYellow.whiteBright(' FTP WARN: '), ...args);
};
log.error = function info(...args) {
  console.log(chalk.bgRed.whiteBright(' FTP WARN: '), ...args);
};

// 本地描述路径 使用描述符，但是分隔符跟本地操作系统有关
// 本地路径 完整的本地路径
// 远程描述路径 使用描述符，但是分隔符固定是posix
// 远程路径 完整的远程路径 分隔符posix

class FTP {
  constructor(option) {
    this.host = option.host;
    this.port = option.port;
    this.username = option.username;
    this.password = option.password;
    this.basePath = option.basePath;
  }

  /**
   * 初始化SFTP协议
   *
   * @returns
   * @memberof FTP
   */
  init() {
    return new Promise(resolve => {
      this.client = new FTPClient();
      this.client.on('ready', () => {
        log.info('FTP连接成功' + '\n');
        resolve();
      });
      this.client.on('greeting', greeting => {
        log.warn(greeting + '\n');
      });
      this.client.on('close', () => {
        log.info('FTP连接关闭');
      });
      this.client.on('end', () => {
        log.info('FTP任务结束');
      });
      this.client.on('error', err => {
        log.error('FTP连接错误:', err);
      });
      // connect to localhost:21 as anonymous
      this.client.connect({
        host: this.host,
        port: this.port,
        user: this.username, // 用户名
        password: this.password,
      });
    }).then(() => {
      return Promise.all([this.checkDir(this.basePath)]);
    });
  }

  /**
   * 判断目录是否存在
   *
   * @param {*} dir
   * @returns
   * @memberof FTP
   */
  checkDir(dir) {
    return new Promise(resolve => {
      this.client.list(dir, (err, list) => {
        if (err) {
          if (err.toString().indexOf('Directory not found') !== -1) {
            log.warn('开发机没有此目录，如确定要发布到此目录，请先到开发机新增目录再回来执行命令：', dir);
          }
          throw err;
        }
        resolve(list);
      });
    });
  }

  /**
   * 创建文件夹
   *
   * @param {*} dir
   * @returns
   * @memberof FTP
   */
  makeDir(dir) {
    return new Promise(resolve => {
      this.client.list(dir, err => {
        if (err && err.toString().indexOf('Directory not found') === -1) {
          throw err;
        } else if (err && err.toString().indexOf('Directory not found') !== -1) {
          this.client.mkdir(dir, err => {
            if (err) throw err;
            resolve();
          });
        } else {
          // 目录已存在
          resolve();
        }
      });
    });
  }

  /**
   * 确保目录存在
   *
   * @param {*} dir
   * @returns
   * @memberof FTP
   */
  ensureDir(dir) {
    const basePath = this.basePath;
    const basePaths = dir.replace(basePath, '').split('/');
    let curPath = basePath;
    let returnPromise = Promise.resolve();
    basePaths.forEach(p => {
      curPath = path.posix.resolve(curPath, p);
      returnPromise = returnPromise.then(() => {
        return this.makeDir(curPath);
      });
    });
    return returnPromise;
  }

  /**
   * 批量写入文件
   *
   * @param {*} map
   * @returns
   * @memberof FTP
   */
  put(map) {
    var ret = Promise.resolve();
    Object.keys(map).forEach(dest => {
      var src = map[dest];
      ret = ret.then(() => {
        return this.writeFile(dest, src);
      });
    });
    return ret;
  }

  /**
   * 写入文件
   *
   * @param {*} dest
   * @param {*} src
   * @returns
   * @memberof FTP
   */
  writeFile(dest, src) {
    return this.ensureDir(path.posix.dirname(dest))
      .then(() => fs.readFileSync(src))
      .then(data => {
        return new Promise(resolve => {
          this.client.put(data, dest, err => {
            if (err) throw err;
            log.info(`上传成功: ${dest}`);
            resolve();
          });
        });
      })
      .catch(err => {
        log.error(`上传失败: ${dest}\n原因:${err.toString()}`);
      });
  }

  /**
   * 设置基础路径
   *
   * @param {*} p
   * @memberof FTP
   */
  setBasePath(p) {
    this.basePath = p;
  }

  /**
   *  关闭链接
   *
   * @memberof FTP
   */
  close() {
    this.client.end();
  }
}

module.exports = FTP;
