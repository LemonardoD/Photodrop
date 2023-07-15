import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { users } from "./users";
import { serial, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { index } from "drizzle-orm/mysql-core/indexes";

export type UserImages = InferModel<typeof userImages>;
export type NewUserImages = InferModel<typeof userImages, "insert">;

export const userImages = mysqlTable(
    "userimages",
    {
        id: serial("id").primaryKey().notNull(),
        phone: varchar("phone", { length: 100 }),
        photoPath: varchar("photoPath", { length: 255 }),
    },
    (userImages) => ({
        alb: foreignKey({
            columns: [userImages.phone],
            foreignColumns: [users.phone],
        }),
        usr_idx: index("usr_idx").on(userImages.phone),
    })
);
