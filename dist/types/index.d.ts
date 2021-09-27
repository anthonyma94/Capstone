declare enum InversifyEnum {
    DATABASE_CONNECTION = "DATABASE_CONNECTION",
    REPOSITORY = "REPOSITORY"
}
declare type InversifyBinding = {
    [key in keyof typeof InversifyEnum]: symbol;
};
export declare const DI_TYPES: InversifyBinding;
export {};
