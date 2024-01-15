
In this `docker-compose.yml` file:

- **Web**: Represents your Astro+Lit application. It is built from the Dockerfile in the current directory (as indicated by `build: .`).

- **Mongo**: Uses the official MongoDB image. Data is persisted using a named volume (`mongodata`), so it remains available across container restarts.

- **NodeAPI**: Represents your Node.js application(s) that interact with MongoDB. Replace `./path_to_node_api` with the path to
