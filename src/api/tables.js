import { get } from "./client";

export const getTable = (number) => get(`/tables/${number}`).then((r) => r.data);
