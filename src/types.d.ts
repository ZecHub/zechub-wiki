export interface Links {
  name: string;
  path: string
}

export interface MenuExp {
  menuExp: boolean;
  setMenuExpanded: (e: boolean) => void;
}

export interface Classes extends MenuExp {
  classes: string;
}

export interface Socials {
  newTab: boolean;
}

export interface Path {
  path: string
}

export interface Sublinks {
  name: string
  path: string
}

export interface SearchInputProps {
  searchInput: string
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface SearchBarProps {
  openSearch: boolean;
  setOpenSearch: (e: boolean) => void;
}

export declare var self: ServiceWorkerGlobalScope;