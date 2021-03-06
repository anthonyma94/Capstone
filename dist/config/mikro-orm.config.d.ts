import { Type } from "@mikro-orm/core";
import { Connection } from "@mikro-orm/core/connections/Connection";
import { IDatabaseDriver } from "@mikro-orm/core/drivers/IDatabaseDriver";
import { Options } from "@mikro-orm/core/utils/Configuration";
declare const _default: Options<IDatabaseDriver<Connection>>;
export default _default;
export declare class TimeType extends Type {
    convertToDatabaseValue(value: string): string;
    convertToJSValue(value: string): string;
    getColumnType(): string;
}
