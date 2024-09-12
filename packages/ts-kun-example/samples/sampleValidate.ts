type Mapper = {
    SampleUser1: SampleUser1;
    SampleUser2: SampleUser2;
};
export function validate<T extends keyof Mapper>(type: T, value: unknown): value is Mapper[T] { switch (type) {
    case "SampleUser1": return typeof value === "object" && value !== null && "name" in value && "plan" in value && typeof value.name === "string" && (value.plan === "free" || value.plan === "pro");
    case "SampleUser2": return typeof value === "object" && value !== null && "id" in value && "email" in value && typeof value.id === "string" && typeof value.email === "string";
} return false; }