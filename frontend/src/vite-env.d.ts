/// <reference types="vite/client" />

declare module "*.json?json" {
  const value: unknown;
  export default value;
}
