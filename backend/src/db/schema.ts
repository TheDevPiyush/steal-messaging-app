import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow(),
  photoURL: text("photo_url"),
  loginOTP: text("loginOTP"),
  loginOTPExpiresAt:timestamp("loginOTPExpiresAt"),
});
