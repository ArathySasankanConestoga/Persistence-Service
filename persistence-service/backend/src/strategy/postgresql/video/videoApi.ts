import { Express } from "express";
import { DataSource } from "typeorm";
import { Video } from "./video";

export default class VideoApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/video/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Video, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/video", async (req, res) => {
      const { body } = req;
      console.log(body);

      const photo = new Video();

      photo.name = body.name;
      photo.description = body.description;
      photo.filename = body.filename;
      photo.views = 0;
      photo.isPublished = true;

      try {
        await this.#dataSource.manager.save(photo);
        console.log(`video has been created with id: ${photo.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Video creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: photo.id,
      });
    });
  }
}
