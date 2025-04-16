# Project: Persistence Service

## Getting Started

---

### Prerequisite

---

This project is containerized. Please have Docker installed. Instructions are
on the README in the project root.

### Development

---

#### Install

Running this command will install all the dependencies for the backend project.

```bash
npm install
```

#### Start Development Server

Running this command will start the development server. The endpoint is at port 8000.

```bash
npm start
```

#### Build

Running this command will build a production ready version of the project.

```bash
npm run build
```

#### Lint

Running this command will run ESLint on the Persistence Service project.

```bash
npm run lint
```

#### Testing

Running this command will run all the tests

```bash
npm run test
```

Running this command will run the tests in watch mode (the tests will re-run on save)

```bash
npm run test -- --watch
```

### Using Dockerfile

---

#### Build the Image

This command has to be ran from within the backend directory.

```bash
docker build --tag persistence-service .
```

#### Build the Container

This command will build and run the container in detached mode. You will be able to hit the container on port 8000.

```bash
docker run -d --name persistence -p 3000:3000 persistence-service
```

#### Removing the Container

This command will kill the running container and remove it.

```bash
docker rm -f persistence


#### Final Exam Functionalities

## **Overview**
This project is a **database-driven service** built using **Node.js, Express, TypeORM, and PostgreSQL**. It manages entities like **Movie, Staff, and ProductionStaff**, and provides **CRUD operations** for these tables.

## **Prerequisites**
Ensure you have the following installed:
- **Node.js** (Recommended: LTS version)
- **Docker & Docker Compose** (For running PostgreSQL & PgAdmin)
- **Postman** (Optional, for API testing)

## **Setup Instructions**
### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo/persistence-service.git
cd persistence-service
```


### 2. Start PostgreSQL Using Docker**
```bash
docker-compose up -d --build
```

The API will be accessible at:  
`http://localhost:8081`

## **Testing with Postman**
1. **Import API Requests:**  
   Open Postman and manually enter API requests, or create a **Postman Collection**.
2. **Make Requests:**  
   - Select the method (`GET`, `POST`, `DELETE`, `PUT`)
   - Provide the correct URL (`http://localhost:8081/movies`)
   - For `POST` & `PUT`, go to `"Body"` tab → Select `"raw → JSON"`.
3. **Verify Responses:**  
   - **200 OK:** Successful operation  
   - **201 Created:** Resource added successfully  
   - **404 Not Found:** Invalid ID  
   - **409 Conflict:** Duplicate entry  
   - **500 Internal Server Error:** Unexpected issues

---

## **Stopping the Server**
To stop the running containers:
```bash
docker-compose down
```

