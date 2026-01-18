import { matchOptions } from "./handle-partidos-table";

export class MatchOptionClient {
    static async getFilter(): Promise<matchOptions> {
        try {
            const filter = await cookieStore.get("partidoFilter");
            return (filter?.value as matchOptions) ?? matchOptions.torneos;
        } catch {
            return matchOptions.torneos;
        }
    }

    static async setFilter(filter: matchOptions): Promise<void> {
        try {
            await cookieStore.set("partidoFilter", filter);
        } catch {
            throw new Error("No se pudo modificar el filtro.");
        }
    }

    static async clearFilter(): Promise<void> { 
        try {
            await cookieStore.delete("partidoFilter");
        } catch {
            throw new Error("No se pudo borrar el filtro.");
        }
    }

}