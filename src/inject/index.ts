import { inject as mongoInject } from "@ngulf/mongo";

export default async function inject() {
	await mongoInject({
    // see https://mongoosejs.com/docs/connections.html
    uris: process.env.MONGO_CONNECTION ?? "mongodb://127.0.0.1:27017/",
    options: {
      dbName: "mojito",
      autoCreate: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
      // useFindAndModify: false,
    },
  });
}