export interface Links {
  name: string;
  path: string
}

export interface MenuExp {
  menuExpanded: boolean;
}

export interface Classes {
  classes: string;
  menuExp: boolean;
}

export interface Socials {
  newTab: boolean;
}

export interface Path{
    path: string
}

export interface Sublinks{
  name: string
  path: string
}

export declare var self: ServiceWorkerGlobalScope;