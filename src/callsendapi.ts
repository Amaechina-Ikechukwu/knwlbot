import request from "request";

class CallSendApi {
  public async SendApi(response: any): Promise<void> {
    try {
      request(
        {
          uri: "https://graph.facebook.com/v17.0/me/messages",
          qs: {
            access_token:
              "EAANJhGNj90MBO0Rjk9ZBanGc9VTFfnJzOCv1015lpNiMyGqzHCfZA0SE4sKDCwaTAlfeDcSVu3bgTxxgzjUr37QSEqneJVpLnKm3cu3ApqqrbqgdUua8pGEIkrEwUw3ZAVLHsZAdqh5SdZCWan4iodn7IBa2F3FqzLP8bHalGSQwZB4ZCupexoXbQJnW3cCrZCup",
          },
          method: "POST",
          json: response,
        },
        (err: any, res: any, body: any) => {
          if (!err && res.statusCode === 200) {
          } else {
            console.error("Unable to send message:", err);
          }
        }
      );
    } catch (error) {
      console.log("Couldnt send at all: " + error);
    }
  }
}

export default CallSendApi;
