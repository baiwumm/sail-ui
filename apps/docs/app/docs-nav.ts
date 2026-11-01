export interface DocLink {
  label: string;
  to: string;
}

export interface DocGroup {
  title: string;
  links: DocLink[];
}
