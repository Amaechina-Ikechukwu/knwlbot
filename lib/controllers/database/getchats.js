"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    constructor(supabase) {
        this.supabase = supabase;
    }
    //ij
    async getChats(tablename) {
        const { data, error } = await this.supabase
            .from(tablename)
            .select("content");
        if (error) {
            return;
        }
        return data;
    }
}
exports.default = ChatController;
//# sourceMappingURL=getchats.js.map