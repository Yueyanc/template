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
import "reflect-metadata";
(_a = process.env).CONFIG_DIRECTORY ?? (_a.CONFIG_DIRECTORY = app.getPath("userData"));
const ServiceContainer = new Container({
  autoBindInjectable: true,
  defaultScope: "Singleton"
});
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
ConfigStoreService = __decorateClass$2([
  injectable()
], ConfigStoreService);
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
let WindowService = class {
  constructor() {
    __publicField(this, "windows", []);
  }
  createWindow(options) {
    const defaultOptions = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 300
    };
    const window = new Window(Object.assign(defaultOptions, options));
    this.windows.push(window);
    return window;
  }
};
WindowService = __decorateClass$1([
  injectable()
], WindowService);
class Window {
  constructor(options) {
    __publicField(this, "window");
    this.window = new BrowserWindow(options);
    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
  }
}
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
  }
};
__decorateClass([
  inject(ConfigStoreService)
], Application.prototype, "ConfigStoreService", 2);
__decorateClass([
  inject(WindowService)
], Application.prototype, "WindowService", 2);
Application = __decorateClass([
  injectable()
], Application);
async function main() {
  const application = await ServiceContainer.getAsync(Application);
  app.whenReady().then(() => {
    application.WindowService.createWindow();
  });
}
main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi9zcmMvaW52ZXJzaWZ5LmNvbmZpZy50cyIsIi4uL3NyYy9zZXJ2aWNlcy9Db25maWdTdG9yZVNlcnZpY2UudHMiLCIuLi9zcmMvc2VydmljZXMvV2luZG93U2VydmljZS50cyIsIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJpbnZlcnNpZnlcIjtcclxuXHJcbnByb2Nlc3MuZW52LkNPTkZJR19ESVJFQ1RPUlkgPz89IGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIik7XHJcblxyXG5leHBvcnQgY29uc3QgU2VydmljZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoe1xyXG4gIGF1dG9CaW5kSW5qZWN0YWJsZTogdHJ1ZSxcclxuICBkZWZhdWx0U2NvcGU6IFwiU2luZ2xldG9uXCIsXHJcbn0pO1xyXG4iLCJpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgeWFtbCBmcm9tIFwieWFtbFwiO1xuaW1wb3J0IHsgd3JpdGVGaWxlIH0gZnJvbSBcImF0b21pY2FsbHlcIjtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ1BhdGggPSBwYXRoLmpvaW4oXG4gIHByb2Nlc3MuZW52LkNPTkZJR19ESVJFQ1RPUlkhLFxuICBcImNvbmZpZy55YW1sXCJcbik7XG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWdTdG9yZVNlcnZpY2Uge1xuICBsb2FkQ29uZmlnKCk6IGFueSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoY29uZmlnUGF0aCkpIHtcbiAgICAgIHJldHVybiB5YW1sLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjb25maWdQYXRoLCBcInV0ZjhcIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2F2ZUNvbmZpZyhjb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB3cml0ZUZpbGUoY29uZmlnUGF0aCwgY29udGVudCwgeyBlbmNvZGluZzogXCJ1dGY4XCIgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEJyb3dzZXJXaW5kb3csIHR5cGUgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgaW5qZWN0YWJsZSB9IGZyb20gXCJpbnZlcnNpZnlcIjtcblxuZXhwb3J0IGludGVyZmFjZSBXaW5kb3dPcHRpb25zIHt9XG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2luZG93U2VydmljZSB7XG4gIHdpbmRvd3M6IFdpbmRvd1tdID0gW107XG4gIGNyZWF0ZVdpbmRvdyhvcHRpb25zPzogQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zID0ge1xuICAgICAgd2lkdGg6IDkwMCxcbiAgICAgIGhlaWdodDogNzAwLFxuICAgICAgbWluV2lkdGg6IDQwMCxcbiAgICAgIG1pbkhlaWdodDogMzAwLFxuICAgIH07XG4gICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvdyhPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSk7XG4gICAgdGhpcy53aW5kb3dzLnB1c2god2luZG93KTtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG59XG5cbmNsYXNzIFdpbmRvdyB7XG4gIHdpbmRvdzogQnJvd3NlcldpbmRvdztcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnMpIHtcbiAgICB0aGlzLndpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KG9wdGlvbnMpO1xuICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKSB7XG4gICAgICB0aGlzLndpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgaW5qZWN0LCBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHsgQ29uZmlnU3RvcmVTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvQ29uZmlnU3RvcmVTZXJ2aWNlXCI7XG5pbXBvcnQgeyBXaW5kb3dTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvV2luZG93U2VydmljZVwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBAaW5qZWN0KENvbmZpZ1N0b3JlU2VydmljZSkgQ29uZmlnU3RvcmVTZXJ2aWNlITogQ29uZmlnU3RvcmVTZXJ2aWNlO1xuICBAaW5qZWN0KFdpbmRvd1NlcnZpY2UpIFdpbmRvd1NlcnZpY2UhOiBXaW5kb3dTZXJ2aWNlO1xuICBjb25zdHJ1Y3RvcigpIHt9XG59XG4iLCJpbXBvcnQgeyBhcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IFNlcnZpY2VDb250YWluZXIgfSBmcm9tIFwiLi9pbnZlcnNpZnkuY29uZmlnXCI7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBhcHBsaWNhdGlvbiA9IGF3YWl0IFNlcnZpY2VDb250YWluZXIuZ2V0QXN5bmM8QXBwbGljYXRpb24+KEFwcGxpY2F0aW9uKTtcbiAgYXBwLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgIGFwcGxpY2F0aW9uLldpbmRvd1NlcnZpY2UuY3JlYXRlV2luZG93KCk7XG4gIH0pO1xufVxuXG5tYWluKCk7XG4iXSwibmFtZXMiOlsiX19kZWNvcmF0ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztDQUdBLGFBQVEsS0FBSSxxQkFBWixHQUFZLG1CQUFxQixJQUFJLFFBQVEsVUFBVTtBQUUxQyxNQUFBLG1CQUFtQixJQUFJLFVBQVU7QUFBQSxFQUM1QyxvQkFBb0I7QUFBQSxFQUNwQixjQUFjO0FBQ2hCLENBQUM7Ozs7Ozs7Ozs7O0FDRk0sTUFBTSxhQUFhLEtBQUs7QUFBQSxFQUM3QixRQUFRLElBQUk7QUFBQSxFQUNaO0FBQ0Y7QUFHTyxJQUFNLHFCQUFOLE1BQXlCO0FBQUEsRUFDOUIsYUFBa0I7QUFDWixRQUFBLEdBQUcsV0FBVyxVQUFVLEdBQUc7QUFDN0IsYUFBTyxLQUFLLE1BQU0sR0FBRyxhQUFhLFlBQVksTUFBTSxDQUFDO0FBQUEsSUFBQSxPQUNoRDtBQUNMLGFBQU87SUFDVDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQU0sV0FBVyxTQUFnQztBQUMvQyxVQUFNLFVBQVUsWUFBWSxTQUFTLEVBQUUsVUFBVSxRQUFRO0FBQUEsRUFDM0Q7QUFDRjtBQVphLHFCQUFOQSxrQkFBQTtBQUFBLEVBRE4sV0FBVztBQUFBLEdBQ0Msa0JBQUE7Ozs7Ozs7Ozs7O0FDUE4sSUFBTSxnQkFBTixNQUFvQjtBQUFBLEVBQXBCO0FBQ0wsbUNBQW9CLENBQUE7QUFBQTtBQUFBLEVBQ3BCLGFBQWEsU0FBMkM7QUFDdEQsVUFBTSxpQkFBa0Q7QUFBQSxNQUN0RCxPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsSUFBQTtBQUViLFVBQU0sU0FBUyxJQUFJLE9BQU8sT0FBTyxPQUFPLGdCQUFnQixPQUFPLENBQUM7QUFDM0QsU0FBQSxRQUFRLEtBQUssTUFBTTtBQUNqQixXQUFBO0FBQUEsRUFDVDtBQUNGO0FBYmEsZ0JBQU5BLGtCQUFBO0FBQUEsRUFETixXQUFXO0FBQUEsR0FDQyxhQUFBO0FBZWIsTUFBTSxPQUFPO0FBQUEsRUFFWCxZQUFZLFNBQTJDO0FBRHZEO0FBRU8sU0FBQSxTQUFTLElBQUksY0FBYyxPQUFPO0FBQ25DLFFBQUEsUUFBUSxJQUFJLHFCQUFxQjtBQUNuQyxXQUFLLE9BQU8sUUFBUSxRQUFRLElBQUksbUJBQW1CO0FBQUEsSUFDckQ7QUFBQSxFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7O0FDdkJPLElBQU0sY0FBTixNQUFrQjtBQUFBLEVBR3ZCLGNBQWM7QUFGYztBQUNMO0FBQUEsRUFDUjtBQUNqQjtBQUg4QixnQkFBQTtBQUFBLEVBQTNCLE9BQU8sa0JBQWtCO0FBQUEsR0FEZixZQUNpQixXQUFBLHNCQUFBLENBQUE7QUFDTCxnQkFBQTtBQUFBLEVBQXRCLE9BQU8sYUFBYTtBQUFBLEdBRlYsWUFFWSxXQUFBLGlCQUFBLENBQUE7QUFGWixjQUFOLGdCQUFBO0FBQUEsRUFETixXQUFXO0FBQUEsR0FDQyxXQUFBO0FDQWIsZUFBZSxPQUFPO0FBQ3BCLFFBQU0sY0FBYyxNQUFNLGlCQUFpQixTQUFzQixXQUFXO0FBQ3hFLE1BQUEsWUFBWSxLQUFLLE1BQU07QUFDekIsZ0JBQVksY0FBYztFQUFhLENBQ3hDO0FBQ0g7QUFFQSxLQUFLOyJ9
