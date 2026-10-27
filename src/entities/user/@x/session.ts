// Публичный API сущности user для сущности session (кросс-импорт по правилам FSD).
export { syncUserFromAuth } from "../api/user-queries";
export type { User } from "../model/user";
