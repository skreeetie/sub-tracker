// Внутри schema/ — только относительные импорты: drizzle-kit не понимает алиас @/.
export { users, type NewUserRow, type UserRow } from "./users";
