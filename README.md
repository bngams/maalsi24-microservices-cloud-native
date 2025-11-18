# NestJS Microservices Architecture

A cloud-native microservices architecture built with NestJS featuring a gateway and two microservices communicating via TCP.

## Architecture Overview

```
┌─────────────┐
│   Gateway   │  (HTTP - Port 3000)
│   (REST)    │
└──────┬──────┘
       │
       ├─────TCP─────┐
       │             │
   ┌───▼────┐   ┌───▼────┐
   │Service │   │Service │
   │   A    │   │   B    │
   │ (TCP)  │   │ (TCP)  │
   └────────┘   └────────┘
   Port 3001    Port 3002
```

This project demonstrates a microservices architecture with:
- **Gateway**: HTTP REST API that acts as an API gateway
- **Service A**: Microservice responding to `helloA` messages
- **Service B**: Microservice responding to `helloB` messages
- **RabbitMQ**: Message broker for event-driven communication (configured but not yet integrated)

## Services

### Gateway (Port 3000)
- HTTP REST API built with NestJS
- Communicates with Service A and Service B via TCP
- Aggregates responses from both microservices
- **Endpoint**: `GET /` - Returns combined responses from both services

### Service A (Port 3001)
- NestJS microservice using TCP transport
- Listens for messages with pattern `{ cmd: 'helloA' }`
- Returns: `Hello from Service A!`

### Service B (Port 3002)
- NestJS microservice using TCP transport
- Listens for messages with pattern `{ cmd: 'helloB' }`
- Returns: `Hello from Service B!`

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Docker & Docker Compose (for RabbitMQ)

## Installation

Install all dependencies for every service at once (using npm workspaces):

```bash
npm install
```

> This will install dependencies for gateway, service-a, service-b, service-clients, and service-orders in one step.

### (Optional) Install Turborepo globally for local CLI usage or use npx

```bash
npm install -g turbo
```

## Running the Services

### Start RabbitMQ

```bash
docker-compose up -d
```

RabbitMQ will be available at:
- **AMQP**: `localhost:5672`
- **Management UI**: http://localhost:15672 (admin/admin)


### Start All Microservices (with Turborepo)

You can start all services in parallel from the root folder:

```bash
npm run dev:all
```

This will launch:
- Gateway (port 3000)
- Service A (port 3001)
- Service B (port 3002)
- Service Clients (port 3003)
- Service Orders (RabbitMQ consumer)

> You can still start any service individually with its own `npm run start:dev` if needed.
## Load Testing (Artillery)

You can simulate load and see RabbitMQ queueing in action using [Artillery](https://artillery.io/):

```bash
# (Optionnal) Install globally if needed
npm install -g artillery

# Run the load test scenario
npm run test:artillery
```

This will send concurrent POST requests to `/clients/:id/generate-invoice` with random client IDs, demonstrating async queueing and processing.

## Testing

Access the gateway:

```bash
curl http://localhost:3000
```

Expected response:
```
Hello from Service A! <br/> Hello from Service B!
```

## Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Transport**: TCP (NestJS Microservices)
- **Message Broker**: RabbitMQ (via Docker)
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Project Structure

```
.
├── docker-compose.yml      # RabbitMQ configuration
├── gateway/                # API Gateway (HTTP)
│   ├── src/
│   │   ├── main.ts        # Bootstrap (HTTP server)
│   │   ├── app.module.ts  # Module with TCP client configs
│   │   ├── app.controller.ts
│   │   └── app.service.ts # Aggregates microservice calls
│   └── package.json
├── service-a/             # Microservice A (TCP)
│   ├── src/
│   │   ├── main.ts        # Bootstrap (TCP microservice)
│   │   ├── app.controller.ts # @MessagePattern handlers
│   │   └── app.service.ts
│   └── package.json
└── service-b/             # Microservice B (TCP)
    ├── src/
    │   ├── main.ts        # Bootstrap (TCP microservice)
    │   ├── app.controller.ts # @MessagePattern handlers
    │   └── app.service.ts
    └── package.json
```

## Communication Pattern

The gateway uses the **Request-Response** pattern:

1. Client sends HTTP request to Gateway (`GET /`)
2. Gateway sends TCP message `{ cmd: 'helloA' }` to Service A
3. Gateway sends TCP message `{ cmd: 'helloB' }` to Service B
4. Both services respond via TCP
5. Gateway aggregates responses and returns HTTP response

## Development Commands

Each service supports:

```bash
npm run start:dev      # Development with watch mode
npm run build          # Build for production
npm run start:prod     # Run production build
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Lint code
npm run format         # Format with Prettier
```

## Next Steps

- Integrate RabbitMQ for event-driven communication
- Add authentication/authorization to gateway
- Implement health checks for microservices
- Add service discovery (e.g., Consul, Eureka)
- Configure environment-based settings
- Add API documentation (Swagger/OpenAPI)
- Implement distributed tracing
- Add database persistence per service

## License

UNLICENSED
