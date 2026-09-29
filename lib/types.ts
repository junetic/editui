export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageContext {
  url: string;
  pathname: string;
  title: string;
}

export interface ViewportContext {
  width: number;
  height: number;
}

export interface ElementContext {
  tag: string;
  text: string;
  id: string | null;
  classes: string[];
  attributes: Record<string, string>;
  selector: string;
  outerHTML: string;
  parentContext: string;
  siblingContext: string;
  computedStyles: Record<string, string>;
  bounds: Bounds;
  role: string | null;
}

export interface Edit {
  id: string;
  instruction: string;
  createdAt: number;
  page: PageContext;
  viewport: ViewportContext;
  elements: ElementContext[];
  fingerprints: string[];
  matchState: 'matched' | 'changed';
}

export interface SentBatch {
  id: string;
  sentAt: number;
  page: PageContext;
  viewport: ViewportContext;
  edits: Edit[];
  prompt: string;
}
