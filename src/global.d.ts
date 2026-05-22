
declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Allow side-effect imports
declare module "*.css" {}
