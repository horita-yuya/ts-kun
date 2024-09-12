# ts-kun

ts-kun is a TypeScript utility that generates useful codes, reading the declared object types in your TypeScript files and 
automatically creates functions. For example a validate function that verify if a given value conforms to a specified type.

# Example

If the following type is declared in your project,

```typescript
type SampleUser1 = {
  name: string;
  plan: "free" | "pro";
};
```

```typescript
type SampleUser2 = {
  id: string;
  age: number;
  email: string;
};
```

ts-kun will generate the following functions.

```typescript
type Mapper = {
  SampleUser1: SampleUser1;
  SampleUser2: SampleUser2;
};
export function validate<T extends keyof Mapper>(
  type: T,
  value: unknown,
): value is Mapper[T] {
  switch (type) {
    case "SampleUser1":
      return (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "plan" in value &&
        typeof value.name === "string" &&
        (value.plan === "free" || value.plan === "pro")
      );
    case "SampleUser2":
      return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "email" in value &&
        typeof value.id === "string" &&
        typeof value.email === "string"
      );
  }
  return false;
}
```

