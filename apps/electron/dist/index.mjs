var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import { app, BrowserWindow } from "electron";
import { Container, injectable, inject } from "inversify";
import path from "node:path";
import fs from "node:fs";
import yaml from "yaml";
import { writeFile } from "atomically";
import { fileURLToPath } from "node:url";
import log from "electron-log/main.js";
import chalk from "chalk";
import logSymbols from "log-symbols";
import { createServer } from "electron-bridge-ipc/electron-main";
import { DisposableStore, ProxyChannel } from "electron-bridge-ipc";
import fse from "fs-extra";
import "reflect-metadata";
(_a = process.env).CONFIG_DIRECTORY ?? (_a.CONFIG_DIRECTORY = app.getPath("userData"));
const ServiceContainer = new Container({
  autoBindInjectable: true,
  defaultScope: "Singleton"
});
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
const configPath = path.join(
  process.env.CONFIG_DIRECTORY,
  "config.yaml"
);
let ConfigStoreService = class {
  loadConfig() {
    if (fs.existsSync(configPath)) {
      return yaml.parse(fs.readFileSync(configPath, "utf8"));
    } else {
      return {};
    }
  }
  async saveConfig(content) {
    await writeFile(configPath, content, { encoding: "utf8" });
  }
};
ConfigStoreService = __decorateClass$4([
  injectable()
], ConfigStoreService);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
log.initialize();
let LoggerService = class {
  constructor() {
  }
  createLogger(options) {
    const logger = log.create({ logId: options.logId });
    logger.transports.console.useStyles = true;
    logger.transports.console.format = ({ message }) => {
      const prints = [chalk.green("Main")];
      switch (message.level) {
        case "info":
          prints.push(logSymbols.info, chalk.blue("info"));
          break;
        case "warn":
          prints.push(logSymbols.warning, chalk.yellow("warning"));
          break;
        case "error":
          prints.push(logSymbols.error, chalk.bgRed("Error"));
          break;
      }
      prints.push(message.date.toLocaleString());
      if (message.scope) prints.push(chalk.gray(`[${message.scope}]`));
      prints.push(">", "\n");
      prints.push(...message.data);
      return prints;
    };
    return options.scope ? logger.scope(options.scope) : logger;
  }
};
LoggerService = __decorateClass$3([
  injectable()
], LoggerService);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let WindowService = class {
  constructor(LoggerService2) {
    __publicField(this, "logger");
    __publicField(this, "windows", []);
    this.LoggerService = LoggerService2;
    this.logger = this.LoggerService.createLogger({
      logId: "WindowService",
      scope: "WindowService"
    });
  }
  createWindow(options) {
    const defaultOptions = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 300,
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs")
      }
    };
    const mergedOptions = Object.assign(defaultOptions, options);
    const window = new Window(mergedOptions);
    this.windows.push(window);
    this.logger.log(`Create Window By`, mergedOptions);
    return window;
  }
};
WindowService = __decorateClass$2([
  injectable(),
  __decorateParam(0, inject(LoggerService))
], WindowService);
class Window {
  constructor(options) {
    __publicField(this, "window");
    this.window = new BrowserWindow(options);
  }
}
class FileSystemService {
  async stat(source) {
    return fse.statSync(source);
  }
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let ChannelService = class {
  constructor() {
    __publicField(this, "server", createServer());
    const disposables = new DisposableStore();
    this.server.registerChannel(
      "fileSystem",
      ProxyChannel.fromService(new FileSystemService(), disposables)
    );
  }
};
ChannelService = __decorateClass$1([
  injectable()
], ChannelService);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp2(target, key, result);
  return result;
};
let Application = class {
  constructor() {
    __publicField(this, "ConfigStoreService");
    __publicField(this, "WindowService");
    __publicField(this, "ChannelService");
  }
  createMainWindow() {
    const mainWindow = this.WindowService.createWindow();
    if (process.env.VITE_DEV_SERVER_URL)
      mainWindow.window.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
};
__decorateClass([
  inject(ConfigStoreService)
], Application.prototype, "ConfigStoreService", 2);
__decorateClass([
  inject(WindowService)
], Application.prototype, "WindowService", 2);
__decorateClass([
  inject(ChannelService)
], Application.prototype, "ChannelService", 2);
Application = __decorateClass([
  injectable()
], Application);
async function main() {
  const application = await ServiceContainer.getAsync(Application);
  app.whenReady().then(() => {
    application.createMainWindow();
  });
}
main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi9zcmMvaW52ZXJzaWZ5LmNvbmZpZy50cyIsIi4uL3NyYy9zZXJ2aWNlcy9Db25maWdTdG9yZVNlcnZpY2UudHMiLCIuLi9zcmMvc2VydmljZXMvTG9nZ2VyU2VydmljZS50cyIsIi4uL3NyYy9zZXJ2aWNlcy9XaW5kb3dTZXJ2aWNlLnRzIiwiLi4vc3JjL3NlcnZpY2VzL0ZpbGVTeXN0ZW1TZXJ2aWNlLnRzIiwiLi4vc3JjL3NlcnZpY2VzL0NoYW5uZWxTZXJ2aWNlLnRzIiwiLi4vc3JjL2FwcC50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAgfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAnaW52ZXJzaWZ5J1xyXG5cclxucHJvY2Vzcy5lbnYuQ09ORklHX0RJUkVDVE9SWSA/Pz0gYXBwLmdldFBhdGgoJ3VzZXJEYXRhJylcclxuXHJcbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcih7XHJcbiAgYXV0b0JpbmRJbmplY3RhYmxlOiB0cnVlLFxyXG4gIGRlZmF1bHRTY29wZTogJ1NpbmdsZXRvbicsXHJcbn0pXHJcbiIsImltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHsgaW5qZWN0YWJsZSB9IGZyb20gJ2ludmVyc2lmeSdcbmltcG9ydCB5YW1sIGZyb20gJ3lhbWwnXG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tICdhdG9taWNhbGx5J1xuXG5leHBvcnQgY29uc3QgY29uZmlnUGF0aCA9IHBhdGguam9pbihcbiAgcHJvY2Vzcy5lbnYuQ09ORklHX0RJUkVDVE9SWSEsXG4gICdjb25maWcueWFtbCcsXG4pXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWdTdG9yZVNlcnZpY2Uge1xuICBsb2FkQ29uZmlnKCk6IGFueSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoY29uZmlnUGF0aCkpIHtcbiAgICAgIHJldHVybiB5YW1sLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjb25maWdQYXRoLCAndXRmOCcpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNhdmVDb25maWcoY29udGVudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgd3JpdGVGaWxlKGNvbmZpZ1BhdGgsIGNvbnRlbnQsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IGxvZyBmcm9tIFwiZWxlY3Ryb24tbG9nL21haW5cIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBsb2dTeW1ib2xzIGZyb20gXCJsb2ctc3ltYm9sc1wiO1xuXG5sb2cuaW5pdGlhbGl6ZSgpO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XG4gIGxvZzogKC4uLnZhbHVlczogYW55W10pID0+IHZvaWQ7XG4gIHdhcm46ICguLi52YWx1ZXM6IGFueVtdKSA9PiB2b2lkO1xuICBlcnJvcjogKC4uLnZhbHVlczogYW55W10pID0+IHZvaWQ7XG59XG5cbmludGVyZmFjZSBDcmVhdGVMb2dnZXJPcHRpb25zIHtcbiAgbG9nSWQ6IHN0cmluZztcbiAgc2NvcGU/OiBzdHJpbmc7XG59XG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBjcmVhdGVMb2dnZXIob3B0aW9uczogQ3JlYXRlTG9nZ2VyT3B0aW9ucykge1xuICAgIGNvbnN0IGxvZ2dlciA9IGxvZy5jcmVhdGUoeyBsb2dJZDogb3B0aW9ucy5sb2dJZCB9KTtcbiAgICBsb2dnZXIudHJhbnNwb3J0cy5jb25zb2xlLnVzZVN0eWxlcyA9IHRydWU7XG4gICAgbG9nZ2VyLnRyYW5zcG9ydHMuY29uc29sZS5mb3JtYXQgPSAoeyBtZXNzYWdlIH0pID0+IHtcbiAgICAgIGNvbnN0IHByaW50cyA9IFtjaGFsay5ncmVlbihcIk1haW5cIildO1xuXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubGV2ZWwpIHtcbiAgICAgICAgY2FzZSBcImluZm9cIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLmluZm8sIGNoYWxrLmJsdWUoXCJpbmZvXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndhcm5cIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLndhcm5pbmcsIGNoYWxrLnllbGxvdyhcIndhcm5pbmdcIikpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLmVycm9yLCBjaGFsay5iZ1JlZChcIkVycm9yXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHByaW50cy5wdXNoKG1lc3NhZ2UuZGF0ZS50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgIGlmIChtZXNzYWdlLnNjb3BlKSBwcmludHMucHVzaChjaGFsay5ncmF5KGBbJHttZXNzYWdlLnNjb3BlfV1gKSk7XG4gICAgICBwcmludHMucHVzaChcIj5cIiwgXCJcXG5cIik7XG4gICAgICBwcmludHMucHVzaCguLi5tZXNzYWdlLmRhdGEpO1xuICAgICAgcmV0dXJuIHByaW50cztcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9wdGlvbnMuc2NvcGUgPyBsb2dnZXIuc2NvcGUob3B0aW9ucy5zY29wZSkgOiBsb2dnZXI7XG4gIH1cbn1cbiIsImltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIHR5cGUgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gJ2VsZWN0cm9uJ1xuaW1wb3J0IHsgaW5qZWN0LCBpbmplY3RhYmxlIH0gZnJvbSAnaW52ZXJzaWZ5J1xuaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9Mb2dnZXJTZXJ2aWNlJ1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKVxuZXhwb3J0IGludGVyZmFjZSBXaW5kb3dPcHRpb25zIHt9XG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2luZG93U2VydmljZSB7XG4gIGxvZ2dlcjogTG9nZ2VyXG4gIHdpbmRvd3M6IFdpbmRvd1tdID0gW11cbiAgY29uc3RydWN0b3IoQGluamVjdChMb2dnZXJTZXJ2aWNlKSBwcml2YXRlIExvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UpIHtcbiAgICB0aGlzLmxvZ2dlciA9IHRoaXMuTG9nZ2VyU2VydmljZS5jcmVhdGVMb2dnZXIoe1xuICAgICAgbG9nSWQ6ICdXaW5kb3dTZXJ2aWNlJyxcbiAgICAgIHNjb3BlOiAnV2luZG93U2VydmljZScsXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZVdpbmRvdyhvcHRpb25zPzogQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zID0ge1xuICAgICAgd2lkdGg6IDkwMCxcbiAgICAgIGhlaWdodDogNzAwLFxuICAgICAgbWluV2lkdGg6IDQwMCxcbiAgICAgIG1pbkhlaWdodDogMzAwLFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgcHJlbG9hZDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3ByZWxvYWQuY2pzJyksXG4gICAgICB9LFxuICAgIH1cbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcbiAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93KG1lcmdlZE9wdGlvbnMpXG4gICAgdGhpcy53aW5kb3dzLnB1c2god2luZG93KVxuICAgIHRoaXMubG9nZ2VyLmxvZyhgQ3JlYXRlIFdpbmRvdyBCeWAsIG1lcmdlZE9wdGlvbnMpXG4gICAgcmV0dXJuIHdpbmRvd1xuICB9XG59XG5cbmNsYXNzIFdpbmRvdyB7XG4gIHdpbmRvdzogQnJvd3NlcldpbmRvd1xuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucykge1xuICAgIHRoaXMud2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3cob3B0aW9ucylcbiAgfVxufVxuIiwiaW1wb3J0IGZzZSBmcm9tICdmcy1leHRyYSdcbmltcG9ydCB7IElGaWxlU3lzdGVtU2VydmljZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1TZXJ2aWNlJ1xuXG5leHBvcnQgY2xhc3MgRmlsZVN5c3RlbVNlcnZpY2UgaW1wbGVtZW50cyBJRmlsZVN5c3RlbVNlcnZpY2Uge1xuICBhc3luYyBzdGF0KHNvdXJjZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGZzZS5zdGF0U3luYyhzb3VyY2UpXG4gIH1cbn1cbiIsImltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdpbnZlcnNpZnknXG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tICdlbGVjdHJvbi1icmlkZ2UtaXBjL2VsZWN0cm9uLW1haW4nXG5pbXBvcnQgeyBEaXNwb3NhYmxlU3RvcmUsIFByb3h5Q2hhbm5lbCB9IGZyb20gJ2VsZWN0cm9uLWJyaWRnZS1pcGMnXG5pbXBvcnQgeyBGaWxlU3lzdGVtU2VydmljZSB9IGZyb20gJy4vRmlsZVN5c3RlbVNlcnZpY2UnXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDaGFubmVsU2VydmljZSB7XG4gIHNlcnZlciA9IGNyZWF0ZVNlcnZlcigpXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IGRpc3Bvc2FibGVzID0gbmV3IERpc3Bvc2FibGVTdG9yZSgpXG4gICAgdGhpcy5zZXJ2ZXIucmVnaXN0ZXJDaGFubmVsKFxuICAgICAgJ2ZpbGVTeXN0ZW0nLFxuICAgICAgUHJveHlDaGFubmVsLmZyb21TZXJ2aWNlKG5ldyBGaWxlU3lzdGVtU2VydmljZSgpLCBkaXNwb3NhYmxlcyksXG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBpbmplY3QsIGluamVjdGFibGUgfSBmcm9tICdpbnZlcnNpZnknXG5pbXBvcnQgeyBDb25maWdTdG9yZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL0NvbmZpZ1N0b3JlU2VydmljZSdcbmltcG9ydCB7IFdpbmRvd1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL1dpbmRvd1NlcnZpY2UnXG5pbXBvcnQgeyBDaGFubmVsU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvQ2hhbm5lbFNlcnZpY2UnXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIEBpbmplY3QoQ29uZmlnU3RvcmVTZXJ2aWNlKSBDb25maWdTdG9yZVNlcnZpY2UhOiBDb25maWdTdG9yZVNlcnZpY2VcbiAgQGluamVjdChXaW5kb3dTZXJ2aWNlKSBXaW5kb3dTZXJ2aWNlITogV2luZG93U2VydmljZVxuICBAaW5qZWN0KENoYW5uZWxTZXJ2aWNlKSBDaGFubmVsU2VydmljZSE6IENoYW5uZWxTZXJ2aWNlXG4gIGNvbnN0cnVjdG9yKCkge31cbiAgY3JlYXRlTWFpbldpbmRvdygpIHtcbiAgICBjb25zdCBtYWluV2luZG93ID0gdGhpcy5XaW5kb3dTZXJ2aWNlLmNyZWF0ZVdpbmRvdygpXG4gICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwpXG4gICAgICBtYWluV2luZG93LndpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwpXG4gIH1cbn1cbiIsImltcG9ydCB7IGFwcCB9IGZyb20gJ2VsZWN0cm9uJ1xuaW1wb3J0IHsgU2VydmljZUNvbnRhaW5lciB9IGZyb20gJy4vaW52ZXJzaWZ5LmNvbmZpZydcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnLi9hcHAnXG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnXG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IGFwcGxpY2F0aW9uID0gYXdhaXQgU2VydmljZUNvbnRhaW5lci5nZXRBc3luYzxBcHBsaWNhdGlvbj4oQXBwbGljYXRpb24pXG4gIGFwcC53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICBhcHBsaWNhdGlvbi5jcmVhdGVNYWluV2luZG93KClcbiAgfSlcbn1cblxubWFpbigpXG4iXSwibmFtZXMiOlsiX19kZWNvcmF0ZUNsYXNzIiwiTG9nZ2VyU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBR0EsYUFBUSxLQUFJLHFCQUFaLEdBQVksbUJBQXFCLElBQUksUUFBUSxVQUFVO0FBRTFDLE1BQUEsbUJBQW1CLElBQUksVUFBVTtBQUFBLEVBQzVDLG9CQUFvQjtBQUFBLEVBQ3BCLGNBQWM7QUFDaEIsQ0FBQzs7Ozs7Ozs7Ozs7QUNGTSxNQUFNLGFBQWEsS0FBSztBQUFBLEVBQzdCLFFBQVEsSUFBSTtBQUFBLEVBQ1o7QUFDRjtBQUdPLElBQU0scUJBQU4sTUFBeUI7QUFBQSxFQUM5QixhQUFrQjtBQUNaLFFBQUEsR0FBRyxXQUFXLFVBQVUsR0FBRztBQUM3QixhQUFPLEtBQUssTUFBTSxHQUFHLGFBQWEsWUFBWSxNQUFNLENBQUM7QUFBQSxJQUFBLE9BRWxEO0FBQ0gsYUFBTztJQUNUO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTSxXQUFXLFNBQWdDO0FBQy9DLFVBQU0sVUFBVSxZQUFZLFNBQVMsRUFBRSxVQUFVLFFBQVE7QUFBQSxFQUMzRDtBQUNGO0FBYmEscUJBQU5BLGtCQUFBO0FBQUEsRUFETixXQUFXO0FBQUEsR0FD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
