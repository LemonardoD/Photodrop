import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { users } from "./users";
import { serial, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { index } from "drizzle-orm/mysql-core/indexes";

export const userimages = mysqlTable("userimages", {
    id: serial("id").primaryKey().notNull(),
    phone: varchar("phone", { length: 100 }),
    photopath: varchar("photopath", { length: 255 }),
    },
    (userimages) => ({
        alb: foreignKey(({
            columns: [userimages.phone],
            foreignColumns: [users.phone],
        })),
        usr_idx: index("usr_idx").on(userimages.phone)
    })
);