export interface Token {
  access_token: String;
  token_type: String;
  expires_in: Number;
  scope: String;
  expires_at: Number;
}

export interface Config {
  project_key: String;
  domain: String;
  client_id: String;
  client_secret: String;
  type: ExtensionType;
}

export enum ExtensionType {
  CategorySelector = 'category',
}

export interface CategoryViewModel {
  name: string;
  key?: string;
  assets?: string[];
  ancestors?: CategoryViewModel[];
}

export interface ProductViewModel {
  name: string;
  description?: string;
  key?: string;
  assets?: string[];
}
