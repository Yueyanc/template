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
          prints.push(logSymbols.warning);
          break;
        case "error":
          prints.push(logSymbols.error);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi9zcmMvaW52ZXJzaWZ5LmNvbmZpZy50cyIsIi4uL3NyYy9zZXJ2aWNlcy9Db25maWdTdG9yZVNlcnZpY2UudHMiLCIuLi9zcmMvc2VydmljZXMvTG9nZ2VyU2VydmljZS50cyIsIi4uL3NyYy9zZXJ2aWNlcy9XaW5kb3dTZXJ2aWNlLnRzIiwiLi4vc3JjL3NlcnZpY2VzL0ZpbGVTeXN0ZW1TZXJ2aWNlLnRzIiwiLi4vc3JjL3NlcnZpY2VzL0NoYW5uZWxTZXJ2aWNlLnRzIiwiLi4vc3JjL2FwcC50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAgfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAnaW52ZXJzaWZ5J1xyXG5cclxucHJvY2Vzcy5lbnYuQ09ORklHX0RJUkVDVE9SWSA/Pz0gYXBwLmdldFBhdGgoJ3VzZXJEYXRhJylcclxuXHJcbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcih7XHJcbiAgYXV0b0JpbmRJbmplY3RhYmxlOiB0cnVlLFxyXG4gIGRlZmF1bHRTY29wZTogJ1NpbmdsZXRvbicsXHJcbn0pXHJcbiIsImltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHsgaW5qZWN0YWJsZSB9IGZyb20gJ2ludmVyc2lmeSdcbmltcG9ydCB5YW1sIGZyb20gJ3lhbWwnXG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tICdhdG9taWNhbGx5J1xuXG5leHBvcnQgY29uc3QgY29uZmlnUGF0aCA9IHBhdGguam9pbihcbiAgcHJvY2Vzcy5lbnYuQ09ORklHX0RJUkVDVE9SWSEsXG4gICdjb25maWcueWFtbCcsXG4pXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWdTdG9yZVNlcnZpY2Uge1xuICBsb2FkQ29uZmlnKCk6IGFueSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoY29uZmlnUGF0aCkpIHtcbiAgICAgIHJldHVybiB5YW1sLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjb25maWdQYXRoLCAndXRmOCcpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNhdmVDb25maWcoY29udGVudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgd3JpdGVGaWxlKGNvbmZpZ1BhdGgsIGNvbnRlbnQsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IGxvZyBmcm9tIFwiZWxlY3Ryb24tbG9nL21haW5cIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBsb2dTeW1ib2xzIGZyb20gXCJsb2ctc3ltYm9sc1wiO1xuXG5sb2cuaW5pdGlhbGl6ZSgpO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XG4gIGxvZzogKC4uLnZhbHVlczogYW55W10pID0+IHZvaWQ7XG4gIHdhcm46ICguLi52YWx1ZXM6IGFueVtdKSA9PiB2b2lkO1xuICBlcnJvcjogKC4uLnZhbHVlczogYW55W10pID0+IHZvaWQ7XG59XG5cbmludGVyZmFjZSBDcmVhdGVMb2dnZXJPcHRpb25zIHtcbiAgbG9nSWQ6IHN0cmluZztcbiAgc2NvcGU/OiBzdHJpbmc7XG59XG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBjcmVhdGVMb2dnZXIob3B0aW9uczogQ3JlYXRlTG9nZ2VyT3B0aW9ucykge1xuICAgIGNvbnN0IGxvZ2dlciA9IGxvZy5jcmVhdGUoeyBsb2dJZDogb3B0aW9ucy5sb2dJZCB9KTtcbiAgICBsb2dnZXIudHJhbnNwb3J0cy5jb25zb2xlLnVzZVN0eWxlcyA9IHRydWU7XG4gICAgbG9nZ2VyLnRyYW5zcG9ydHMuY29uc29sZS5mb3JtYXQgPSAoeyBtZXNzYWdlIH0pID0+IHtcbiAgICAgIGNvbnN0IHByaW50cyA9IFtjaGFsay5ncmVlbihcIk1haW5cIildO1xuXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubGV2ZWwpIHtcbiAgICAgICAgY2FzZSBcImluZm9cIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLmluZm8sIGNoYWxrLmJsdWUoXCJpbmZvXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndhcm5cIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLndhcm5pbmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICBwcmludHMucHVzaChsb2dTeW1ib2xzLmVycm9yKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHByaW50cy5wdXNoKG1lc3NhZ2UuZGF0ZS50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgIGlmIChtZXNzYWdlLnNjb3BlKSBwcmludHMucHVzaChjaGFsay5ncmF5KGBbJHttZXNzYWdlLnNjb3BlfV1gKSk7XG4gICAgICBwcmludHMucHVzaChcIj5cIiwgXCJcXG5cIik7XG4gICAgICBwcmludHMucHVzaCguLi5tZXNzYWdlLmRhdGEpO1xuICAgICAgcmV0dXJuIHByaW50cztcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9wdGlvbnMuc2NvcGUgPyBsb2dnZXIuc2NvcGUob3B0aW9ucy5zY29wZSkgOiBsb2dnZXI7XG4gIH1cbn1cbiIsImltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIHR5cGUgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgaW5qZWN0LCBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vTG9nZ2VyU2VydmljZVwiO1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcbmV4cG9ydCBpbnRlcmZhY2UgV2luZG93T3B0aW9ucyB7fVxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFdpbmRvd1NlcnZpY2Uge1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgd2luZG93czogV2luZG93W10gPSBbXTtcbiAgY29uc3RydWN0b3IoQGluamVjdChMb2dnZXJTZXJ2aWNlKSBwcml2YXRlIExvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UpIHtcbiAgICB0aGlzLmxvZ2dlciA9IHRoaXMuTG9nZ2VyU2VydmljZS5jcmVhdGVMb2dnZXIoe1xuICAgICAgbG9nSWQ6IFwiV2luZG93U2VydmljZVwiLFxuICAgICAgc2NvcGU6IFwiV2luZG93U2VydmljZVwiLFxuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlV2luZG93KG9wdGlvbnM/OiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnMgPSB7XG4gICAgICB3aWR0aDogOTAwLFxuICAgICAgaGVpZ2h0OiA3MDAsXG4gICAgICBtaW5XaWR0aDogNDAwLFxuICAgICAgbWluSGVpZ2h0OiAzMDAsXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICBwcmVsb2FkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcInByZWxvYWQuY2pzXCIpLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93KG1lcmdlZE9wdGlvbnMpO1xuICAgIHRoaXMud2luZG93cy5wdXNoKHdpbmRvdyk7XG4gICAgdGhpcy5sb2dnZXIubG9nKGBDcmVhdGUgV2luZG93IEJ5YCwgbWVyZ2VkT3B0aW9ucyk7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxufVxuXG5jbGFzcyBXaW5kb3cge1xuICB3aW5kb3c6IEJyb3dzZXJXaW5kb3c7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zKSB7XG4gICAgdGhpcy53aW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyhvcHRpb25zKTtcbiAgfVxufVxuIiwiaW1wb3J0IGZzZSBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtU2VydmljZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtU2VydmljZVwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZVN5c3RlbVNlcnZpY2UgaW1wbGVtZW50cyBJRmlsZVN5c3RlbVNlcnZpY2Uge1xuICBhc3luYyBzdGF0KHNvdXJjZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGZzZS5zdGF0U3luYyhzb3VyY2UpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHsgY3JlYXRlU2VydmVyIH0gZnJvbSBcImVsZWN0cm9uLWJyaWRnZS1pcGMvZWxlY3Ryb24tbWFpblwiO1xuaW1wb3J0IHsgRGlzcG9zYWJsZVN0b3JlLCBQcm94eUNoYW5uZWwgfSBmcm9tIFwiZWxlY3Ryb24tYnJpZGdlLWlwY1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbVNlcnZpY2UgfSBmcm9tIFwiLi9GaWxlU3lzdGVtU2VydmljZVwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2hhbm5lbFNlcnZpY2Uge1xuICBzZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIoKTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZXMgPSBuZXcgRGlzcG9zYWJsZVN0b3JlKCk7XG4gICAgdGhpcy5zZXJ2ZXIucmVnaXN0ZXJDaGFubmVsKFxuICAgICAgXCJmaWxlU3lzdGVtXCIsXG4gICAgICBQcm94eUNoYW5uZWwuZnJvbVNlcnZpY2UobmV3IEZpbGVTeXN0ZW1TZXJ2aWNlKCksIGRpc3Bvc2FibGVzKVxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGluamVjdCwgaW5qZWN0YWJsZSB9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7IENvbmZpZ1N0b3JlU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL0NvbmZpZ1N0b3JlU2VydmljZVwiO1xuaW1wb3J0IHsgV2luZG93U2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL1dpbmRvd1NlcnZpY2VcIjtcbmltcG9ydCB7IENoYW5uZWxTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvQ2hhbm5lbFNlcnZpY2VcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgQGluamVjdChDb25maWdTdG9yZVNlcnZpY2UpIENvbmZpZ1N0b3JlU2VydmljZSE6IENvbmZpZ1N0b3JlU2VydmljZTtcbiAgQGluamVjdChXaW5kb3dTZXJ2aWNlKSBXaW5kb3dTZXJ2aWNlITogV2luZG93U2VydmljZTtcbiAgQGluamVjdChDaGFubmVsU2VydmljZSkgQ2hhbm5lbFNlcnZpY2UhOiBDaGFubmVsU2VydmljZTtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBjcmVhdGVNYWluV2luZG93KCkge1xuICAgIGNvbnN0IG1haW5XaW5kb3cgPSB0aGlzLldpbmRvd1NlcnZpY2UuY3JlYXRlV2luZG93KCk7XG4gICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwpXG4gICAgICBtYWluV2luZG93LndpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IFNlcnZpY2VDb250YWluZXIgfSBmcm9tIFwiLi9pbnZlcnNpZnkuY29uZmlnXCI7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBhcHBsaWNhdGlvbiA9IGF3YWl0IFNlcnZpY2VDb250YWluZXIuZ2V0QXN5bmM8QXBwbGljYXRpb24+KEFwcGxpY2F0aW9uKTtcbiAgYXBwLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgIGFwcGxpY2F0aW9uLmNyZWF0ZU1haW5XaW5kb3coKTtcbiAgfSk7XG59XG5cbm1haW4oKTtcbiJdLCJuYW1lcyI6WyJfX2RlY29yYXRlQ2xhc3MiLCJMb2dnZXJTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FHQSxhQUFRLEtBQUkscUJBQVosR0FBWSxtQkFBcUIsSUFBSSxRQUFRLFVBQVU7QUFFMUMsTUFBQSxtQkFBbUIsSUFBSSxVQUFVO0FBQUEsRUFDNUMsb0JBQW9CO0FBQUEsRUFDcEIsY0FBYztBQUNoQixDQUFDOzs7Ozs7Ozs7OztBQ0ZNLE1BQU0sYUFBYSxLQUFLO0FBQUEsRUFDN0IsUUFBUSxJQUFJO0FBQUEsRUFDWjtBQUNGO0FBR08sSUFBTSxxQkFBTixNQUF5QjtBQUFBLEVBQzlCLGFBQWtCO0FBQ1osUUFBQSxHQUFHLFdBQVcsVUFBVSxHQUFHO0FBQzdCLGFBQU8sS0FBSyxNQUFNLEdBQUcsYUFBYSxZQUFZLE1BQU0sQ0FBQztBQUFBLElBQUEsT0FFbEQ7QUFDSCxhQUFPO0lBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNLFdBQVcsU0FBZ0M7QUFDL0MsVUFBTSxVQUFVLFlBQVksU0FBUyxFQUFFLFVBQVUsUUFBUTtBQUFBLEVBQzNEO0FBQ0Y7QUFi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
