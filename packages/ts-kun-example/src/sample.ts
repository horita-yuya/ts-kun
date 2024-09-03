export type User = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
};

export declare function validateUser(input: unknown): input is User;
