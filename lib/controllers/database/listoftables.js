"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListOfTablesController {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getTables(tablename) {
        try {
            const { error } = await this.supabase
                .from("chats")
                .select("id")
                .eq("tablename", tablename)
                .limit(1);
            if (error) {
                console.error("Error retrieving chat table:", error);
                return false; // Return an empty array in case of an error
            }
            else {
                return true; // Return the data array or an empty array if it's null
            }
        }
        catch (error) {
            console.error("Error getting tables:", error);
            return false; // Return an empty array in case of an error
        }
    }
}
exports.default = ListOfTablesController;
//# sourceMappingURL=listoftables.js.map