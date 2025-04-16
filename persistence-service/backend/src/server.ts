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
      find: (entity: any) => ({
        name: "a testname",
        description: "description",
        filename: "photo-with-bears.jpg",
        views: 1,
        isPublished: true,
      }),
      save: (entity: any) => {
        console.log("Saving entity:", entity);
        return {
          name: "a testname",
          description: "description",
          filename: "photo-with-bears.jpg",
          views: 1,
          isPublished: true,
        };
      },
    },
  };
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

  app.get("/sample", (_, res) => {
    return res.send("Hello world 2");
  });

  function realBearCreator(name: string, description: string): Photo {
    const photo = new Photo();
    photo.name = name;
    photo.description = description;
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    console.log("Created a bear photo:", photo);
    return photo;
  }

  function successFailedBearCreator(name: string, description: string): Photo | null {
    const restricted = ["duck", "cat", "dog", "fox"];

    if (restricted.includes(name.toLowerCase())) {
      console.log(`${name}s are not bears.`);
      return null;
    }

    return realBearCreator(name, description);
  }

  function failureFailedBearCreator(name: string, description: string): Photo | null {
    if (!name.trim() || !description.trim()) {
      console.log("Invalid name or description.");
      return null;
    }

    return realBearCreator(name, description);
  }

  
  const functionMap: Record<string, (name: string, description: string) => Photo | null> = {
    realBearCreator,
    successFailedBearCreator,
    failureFailedBearCreator,
  };

  app.post("/bearphoto/:name/:description", async (req, res) => {
    const name = req.params.name;
    const description = req.params.description;

    console.log("Received request:", { name, description, creatorFunction: req.body.creatorFunction });

    const existingPhoto = await datasource.manager.find(Photo, {
      where: { name, description },
    });

    if (existingPhoto.length > 0) {
      return res.status(409).send({ message: "Photo already exists." });
    }

    
    const selectedFunction = functionMap[req.body.creatorFunction];

    if (!selectedFunction) {
      return res.status(400).send({ message: "Invalid function name provided." });
    }

    const result = await createPhotoBear(name, description, selectedFunction);

    if (!result.result) {
      return res.status(400).send({ message: "Invalid request." });
    }

    await datasource.manager.save(result.result);

    res.status(200).send(result);
  });

  async function createPhotoBear(
    name: string,
    description: string,
    creatorFunction: (name: string, description: string) => Photo | null
  ): Promise<{ status: number; message: string; result?: Photo }> {
    name = name.toLowerCase();
    description = description.toLowerCase();

    const photo = creatorFunction(name, description);

    if (!photo) {
      return { status: 400, message: "Invalid request." };
    }

    return { status: 200, message: "Operation successful.", result: photo };
  }

  app.listen(8000, () => {
    console.log(`Express server started on port 8000`);
  });

})().catch((err) => console.log(err));
