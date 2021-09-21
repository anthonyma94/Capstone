import { Entity, PrimaryKey } from "@mikro-orm/core";
import { v4 } from "uuid";
@Entity({ abstract: true })
export default abstract class BaseEntity {
    @PrimaryKey()
    id = v4();
}
