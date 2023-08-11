import request from "request";

class CallSendApi {
  public async SendApi(response: any): Promise<void> {
    try {
      request(
        {
          uri: "https://graph.facebook.com/v17.0/me/messages",
          qs: {
            access_token:
              "EAAWZBOFgWDNoBOxT7hYFTYpV76u3ef92PNXOqWChqkTJX6uGCDm00r9VMlFVdduezSZCZA8JpttR96pWRIXkUkbDigM1Vi7LfrbB2fvQNLoIFfMn3JWeOiBOHqLWVbKKoop1ZAdZCFTEe1dkdsHfdZCIL4GLcBSNg03LEWZBNR5IOR7dCXPRVEZCJa5fkNeXykpT",
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
