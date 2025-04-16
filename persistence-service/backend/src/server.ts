import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import { Photo } from "./strategy/postgresql/photo";
import { Video } from "./strategy/postgresql/video";
import { Movie } from "./strategy/postgresql/movie";
import { Staff } from "./strategy/postgresql/staff";

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







// GET: Retrieve all movies
app.get("/movies", async (_, res) => {
  try {
    const result = await datasource.manager.find(Movie);
    console.log(result);
    return res.send(result);
  } catch (error) {
    console.error("Error retrieving movies:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Function to create a movie instance
function createMovie(movieName: string, releaseDate: Date, rating: number, genre: string, award: string): Movie {
  const movie = new Movie();
  movie.movieName = movieName;
  movie.releaseDate = releaseDate;
  movie.rating = rating;
  movie.genre = genre;
  movie.award = award;

  console.log("Created movie:", movie);
  return movie;
}

// POST: Create a new movie entry
app.post("/movies", async (req, res) => {
  try {
    const { movieName, releaseDate, rating, genre, award } = req.body;

    console.log("Received request:", { movieName, releaseDate, rating, genre, award });

    const existingMovie = await datasource.manager.find(Movie, {
      where: { movieName, releaseDate: new Date(releaseDate) }, // Ensure conversion to Date
    });

    if (existingMovie.length > 0) {
      return res.status(409).send({ message: "Movie already exists." });
    }

    const newMovie = createMovie(movieName, new Date(releaseDate), parseFloat(rating), genre, award);

    await datasource.manager.save(newMovie);
    res.status(201).send({ status: 201, message: "Movie created successfully.", result: newMovie });
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// DELETE: Remove a movie entry
app.delete("/movies/:id", async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    const movie = await datasource.manager.findOne(Movie, { where: { id: movieId } });

    if (!movie) {
      return res.status(404).send({ message: "Movie not found." });
    }

    await datasource.manager.remove(movie);
    res.status(200).send({ message: "Movie deleted successfully." });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// PUT: Update a movie entry
app.put("/movies/:id", async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const { movieName, releaseDate, rating, genre, award } = req.body;

    const movie = await datasource.manager.findOne(Movie, { where: { id: movieId } });

    if (!movie) {
      return res.status(404).send({ message: "Movie not found." });
    }

    movie.movieName = movieName || movie.movieName;
    movie.releaseDate = releaseDate ? new Date(releaseDate) : movie.releaseDate; // Ensure conversion
    movie.rating = rating ? parseFloat(rating) : movie.rating;
    movie.genre = genre || movie.genre;
    movie.award = award || movie.award;

    await datasource.manager.save(movie);
    res.status(200).send({ message: "Movie updated successfully.", result: movie });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});






// GET: Retrieve all staff members
app.get("/staff", async (_, res) => {
  try {
    const result = await datasource.manager.find(Staff);
    console.log(result);
    return res.send(result);
  } catch (error) {
    console.error("Error retrieving staff members:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Function to create a staff member instance
function createStaff(
  staffName: string,
  unionId: number,
  dateOfBirth: Date,
  phoneNumber: number,
  nationality: string,
  email: string,
  staff_role: string,
  biography_name: string
): Staff {
  const staff = new Staff();
  staff.staffName = staffName;
  staff.unionId = unionId;
  staff.dateOfBirth = dateOfBirth;
  staff.phoneNumber = phoneNumber;
  staff.nationality = nationality;
  staff.email = email;
  staff.staff_role = staff_role;
  staff.biography_name = biography_name;

  console.log("Created staff:", staff);
  return staff;
}

// POST: Create a new staff member
app.post("/staff", async (req, res) => {
  try {
    const { staffName, unionId, dateOfBirth, phoneNumber, nationality, email, staff_role, biography_name } = req.body;

    console.log("Received request:", { staffName, unionId, dateOfBirth, phoneNumber, nationality, email, staff_role, biography_name });

    const existingStaff = await datasource.manager.find(Staff, {
      where: { email },
    });

    if (existingStaff.length > 0) {
      return res.status(409).send({ message: "Staff member with this email already exists." });
    }

    const newStaff = createStaff(
      staffName,
      unionId,
      new Date(dateOfBirth),
      phoneNumber,
      nationality,
      email,
      staff_role,
      biography_name
    );

    await datasource.manager.save(newStaff);
    res.status(201).send({ status: 201, message: "Staff member created successfully.", result: newStaff });
  } catch (error) {
    console.error("Error creating staff member:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// DELETE: Remove a staff member
app.delete("/staff/:id", async (req, res) => {
  try {
    const staffId = parseInt(req.params.id);

    const staff = await datasource.manager.findOne(Staff, { where: { staffId } });

    if (!staff) {
      return res.status(404).send({ message: "Staff member not found." });
    }

    await datasource.manager.remove(staff);
    res.status(200).send({ message: "Staff member deleted successfully." });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// PUT: Update a staff member entry
app.put("/staff/:id", async (req, res) => {
  try {
    const staffId = parseInt(req.params.id);
    const { staffName, unionId, dateOfBirth, phoneNumber, nationality, email, staff_role, biography_name } = req.body;

    const staff = await datasource.manager.findOne(Staff, { where: { staffId } });

    if (!staff) {
      return res.status(404).send({ message: "Staff member not found." });
    }

    staff.staffName = staffName || staff.staffName;
    staff.unionId = unionId !== undefined ? unionId : staff.unionId;
    staff.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : staff.dateOfBirth;
    staff.phoneNumber = phoneNumber !== undefined ? phoneNumber : staff.phoneNumber;
    staff.nationality = nationality || staff.nationality;
    staff.email = email || staff.email;
    staff.staff_role = staff_role || staff.staff_role;
    staff.biography_name = biography_name || staff.biography_name;

    await datasource.manager.save(staff);
    res.status(200).send({ message: "Staff member updated successfully.", result: staff });
  } catch (error) {
    console.error("Error updating staff member:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});




// GET: Retrieve all contracts
app.get("/contracts", async (_, res) => {
  try {
    const result = await datasource.manager.find(Contract);
    console.log(result);
    return res.send(result);
  } catch (error) {
    console.error("Error retrieving contracts:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Function to create a contract instance
function createContract(staffId: number, productionCost: number): Contract {
  const contract = new Contract();
  contract.staff_id = staffId;
  contract.production_cost = productionCost;

  console.log("Created contract:", contract);
  return contract;
}

// POST: Create a new contract entry
app.post("/contracts", async (req, res) => {
  try {
    const { staff_id, production_cost } = req.body;

    console.log("Received request:", { staff_id, production_cost });

    const newContract = createContract(staff_id, parseFloat(production_cost));

    await datasource.manager.save(newContract);
    res.status(201).send({ status: 201, message: "Contract created successfully.", result: newContract });
  } catch (error) {
    console.error("Error creating contract:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// DELETE: Remove a contract entry
app.delete("/contracts/:id", async (req, res) => {
  try {
    const contractId = parseInt(req.params.id);

    const contract = await datasource.manager.findOne(Contract, { where: { contract_Id: contractId } });

    if (!contract) {
      return res.status(404).send({ message: "Contract not found." });
    }

    await datasource.manager.remove(contract);
    res.status(200).send({ message: "Contract deleted successfully." });
  } catch (error) {
    console.error("Error deleting contract:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// PUT: Update a contract entry
app.put("/contracts/:id", async (req, res) => {
  try {
    const contractId = parseInt(req.params.id);
    const { staff_id, production_cost } = req.body;

    const contract = await datasource.manager.findOne(Contract, { where: { contract_Id: contractId } });

    if (!contract) {
      return res.status(404).send({ message: "Contract not found." });
    }

    contract.staff_id = staff_id !== undefined ? staff_id : contract.staff_id;
    contract.production_cost = production_cost !== undefined ? parseFloat(production_cost) : contract.production_cost;

    await datasource.manager.save(contract);
    res.status(200).send({ message: "Contract updated successfully.", result: contract });
  } catch (error) {
    console.error("Error updating contract:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});



  

  app.listen(8000, () => {
    console.log(`Express server started on port 8000`);
  });

})().catch((err) => console.log(err));
