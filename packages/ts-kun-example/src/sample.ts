export type User = {
  id: number;
  name: string;
};

export declare function validateUser(input: unknown): input is User;
