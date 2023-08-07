"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class CallSendApi {
    async SendApi(response) {
        try {
            (0, request_1.default)({
                uri: "https://graph.facebook.com/v17.0/me/messages",
                qs: {
                    access_token: "EAANJhGNj90MBO0Rjk9ZBanGc9VTFfnJzOCv1015lpNiMyGqzHCfZA0SE4sKDCwaTAlfeDcSVu3bgTxxgzjUr37QSEqneJVpLnKm3cu3ApqqrbqgdUua8pGEIkrEwUw3ZAVLHsZAdqh5SdZCWan4iodn7IBa2F3FqzLP8bHalGSQwZB4ZCupexoXbQJnW3cCrZCup",
                },
                method: "POST",
                json: response,
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                }
                else {
                    console.error("Unable to send message:", err);
                }
            });
        }
        catch (error) {
            console.log("Couldnt send at all: " + error);
        }
    }
}
exports.default = CallSendApi;
//# sourceMappingURL=callsendapi.js.map