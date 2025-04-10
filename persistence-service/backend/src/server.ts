import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import { Photo } from "./strategy/postgresql/photo";
import { Video } from "./strategy/postgresql/video";

async function datamanager(environment: "prod" | "test") {
  if (environment === "prod") {
    return postgresDataSource.initialize();
  }
  
  return {
    manager: {
      find: (entity: any) => {
        return {
          name: "a testname",
          description: "description",
          filename: "photo-with-bears.jpg",
          views: 1,
          isPublished: true,
        }//save should be there
      }
    }
  }
}


(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  const datasource = await postgresDataSource.initialize();

  app.get("/bearphoto", async (_, res) => {
    const result = await datasource.manager.find(Photo);

    console.log(result);

    return res.send(result);
  });

  // get
  app.get("/sample", (_, res) => {
    return res.send("hello world 2")
  });

  // create
  app.post("/bearphoto/:name/:description", async (req, res) => {
    const name = req.params.name;

    if (name === "duck") {
      res.status(302);
      return res.send("ducks are not bears");
    }

    const description = req.params.description;

    const photo = new Photo()
    photo.name = name;
    photo.description = description
    photo.filename = "photo-with-bears.jpg"
    photo.views = 1
    photo.isPublished = true

    await datasource.manager.save(photo)
    return res.send({ message: "this operation was successful."})
  });

  app.post("/catphoto/:name/:description", async (req, res) => {
    const name = req.params.name;

    if (name === "duck") {
      res.status(302);
      return res.send("ducks are not cats");
    }

    const description = req.params.description;

    const photo = new Video()
    photo.name = name;
    photo.description = description
    photo.filename = "photo-with-cats.jpg"
    photo.views = 1
    photo.isPublished = true

    await datasource.manager.save(photo)
    return res.send({ message: "this operation was successful."})
  });

  //edit
  // app.put


  // delete
  // app.delete
  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));
