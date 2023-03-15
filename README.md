# SlackGPT

## Getting started

### Development

```bash
# Set up a development database (requires Docker)
npm run dev:db
# Run in development mode
npm run dev:node
# Start ngrok
npm run dev:ngrok

# ... or just run all at once
npm run dev
```

### Production

```bash
# Create a production build
npm run build

# Run the production build
npm run start
```

#### Docker

```bash
# Create a Docker image
docker build -t typescript-starter .
# Start up a Docker container
docker run --name typescript-starter -it typescript-starter

# Or just use Docker Compose
docker compose up
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](LICENSE.md)
