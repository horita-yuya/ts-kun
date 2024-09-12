type Mapper = {
    User: User;
    PremiumUser: PremiumUser;
};
export function validate<T extends keyof Mapper>(type: T, value: unknown): value is Mapper[T] { switch (type) {
    case "User": return typeof value === "object" && value !== null;
    case "PremiumUser": return typeof value === "object" && value !== null;
} return false; }
