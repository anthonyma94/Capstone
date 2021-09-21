enum InversifyEnum {
    DATABASE_CONNECTION = "DATABASE_CONNECTION",
    REPOSITORY = "REPOSITORY"
}

type InversifyBinding = { [key in keyof typeof InversifyEnum]: symbol };

const mapEnumToTypes = <T>(typeEnum: T): InversifyBinding => {
    const typesObject: any = {};
    Object.keys(typeEnum).forEach((key: string): void => {
        typesObject[key] = Symbol.for(key);
    });

    return typesObject as InversifyBinding;
};

// Used By Inversify For Identifying Bindings At Runtime
export const DI_TYPES = mapEnumToTypes(InversifyEnum);
