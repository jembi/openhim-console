declare module '*.html' {
  const rawHtmlFile: string
  export = rawHtmlFile
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '@jembi/openhim-core-api' {

  interface App {
    _id: string;
    name: string;
    description: string;
    icon: string;
    type: string;
    category: string;
    access_roles: string[];
    url: string;
    showInPortal: boolean;
    showInSideBar: boolean;
    __v: number;
  }

  interface Config {
    protocol: string;
    host: string;
    port: number;
    hostPath?: string;
  }

  export function fetchApps(): Promise<App[]>;

  export function getAllApps(): Promise<App[]>;

  export function fetchApp(id: string): Promise<App>;

  export function editApp(id: string, data: App): Promise<App>;

  export function deleteApp(id: string): Promise<void>;

  export function fetchCategories(): Promise<string[]>;

  export function fetchAppsByCategory(category: string): Promise<App[]>;

  export function fetchAppsGroupedByCategory(): Promise<{ category: string; apps: App[] }[]>;

  export function addApp(app: App): Promise<App>;

  export function getImportMap(): Promise<any>;

  export function getRoles(): Promise<any>;

  export function getChannels(): Promise<any>;
}