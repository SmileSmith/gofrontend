const SSH2Client = require('ssh2').Client;
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

/**
 * 日志对象
 *
 */
function log() {}
log.info = function info(...args) {
  console.log(chalk.bgCyan.whiteBright(' SFTP INFO: '), ...args);
};
log.warn = function info(...args) {
  console.log(chalk.bgYellow.whiteBright(' SFTP WARN: '), ...args);
};
log.error = function info(...args) {
  console.log(chalk.bgRed.whiteBright(' SFTP WARN: '), ...args);
};

// 本地描述路径 使用描述符，但是分隔符跟本地操作系统有关
// 本地路径 完整的本地路径
// 远程描述路径 使用描述符，但是分隔符固定是posix
// 远程路径 完整的远程路径 分隔符posix

class SFTP {
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
   * @memberof SFTP
   */
  init() {
    return new Promise(resolve => {
      this.client = new SSH2Client();
      this.client.on('ready', () => {
        this.client.sftp((err, sftp) => {
          if (err) throw err;
          this.sftp = sftp;
          resolve();
        });
      });
      this.client.on('close', () => {
        log.info('FTP连接关闭');
      });
      this.client.on('end', () => {
        log.info('end');
      });
      this.client.on('error', err => {
        log.error('FTP连接错误:', err);
      });
      // connect to localhost:21 as anonymous
      this.client.connect({
        host: this.host,
        port: this.port,
        username: this.username, // 用户名
        password: this.password,
        debug: log.info,
      });
    }).then(() => {
      return Promise.all([this.checkDir(this.sourceDir)]);
    });
  }

  /**
   * 判断目录是否存在
   *
   * @param {*} dir
   * @returns
   * @memberof SFTP
   */
  checkDir(dir) {
    return new Promise(resolve => {
      this.sftp.readdir(dir, (err, list) => {
        if (err) {
          if (err.toString().indexOf('No such file') !== -1) {
            log.error('开发机没有此目录，如确定要发布到此目录，请先到开发机新增目录再回来执行命令：', dir);
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
   * @memberof SFTP
   */
  makeDir(dir) {
    return new Promise(resolve => {
      this.sftp.opendir(dir, err => {
        if (err && err.toString().indexOf('No such file') === -1) {
          throw err;
        } else if (err && err.toString().indexOf('No such file') !== -1) {
          this.sftp.mkdir(dir, err => {
            if (err) throw err;
            resolve();
          });
        } else {
          log.warn(`目录已存在`);
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
   * @memberof SFTP
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
   * @memberof SFTP
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
   * @memberof SFTP
   */
  writeFile(dest, src) {
    log.info(`正在上传文件: ${src} to\n${dest}`);
    return this.ensureDir(path.posix.dirname(dest))
      .then(() => fs.readFileSync(src))
      .then(data => {
        return new Promise(resolve => {
          this.sftp.open(dest, 'w', err => {
            if (err) throw err;
            this.sftp.writeFile(dest, data, err => {
              if (err) throw err;
              log.info(`上传文件: ${src} to\n${dest}`);
              resolve();
            });
          });
        });
      })
      .catch(err => {
        log.error(`上传文件失败: ${src}\n${dest}\n失败:${err.toString()}`);
      });
  }

  /**
   * 设置基础路径
   *
   * @param {*} p
   * @memberof SFTP
   */
  setBasePath(p) {
    this.basePath = p;
  }

  /**
   *  关闭链接
   *
   * @memberof SFTP
   */
  close() {
    this.client.end();
  }
}

module.exports = SFTP;
