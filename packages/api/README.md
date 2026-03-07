# Pleasant Coffee API

A GraphQL API built with [Pothos](https://pothos-graphql.dev) and [Prisma](https://www.prisma.io).

## Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime
- [Docker](https://www.docker.com) - For running the PostgreSQL database

## Quick Start

### 1. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The default configuration connects to a PostgreSQL database running in Docker:
```
DATABASE_URL="postgresql://admin:postgres@localhost:5432/pleasant-db?schema=public"
```

### 2. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
bun run compose:up
```

This will:
- Start a PostgreSQL 18 container named `db`
- Expose the database on `localhost:5432`
- Create a database named `pleasant-db` with user `admin` and password `postgres`
- Mount a volume for persistent data

To check if the database is running:
```bash
docker ps
```

### 3. Run Database Migrations

Apply all pending Prisma migrations:

```bash
bun run migrate:dev
```

This will:
- Create all database tables and schemas
- Run any new migrations not yet applied to the database
- Prompt you to create a new migration if the schema has changed

### 4. Generate Prisma Types

Generate TypeScript types and Pothos type definitions:

```bash
bun run gen
```

This creates:
- `src/generated/prisma/` - Prisma Client types
- `src/generated/pothos-prisma-types.ts` - Pothos resolver types for type-safe GraphQL schema

### 5. Start the Development Server

Run the API in development mode with hot reload:

```bash
bun run dev
```

The GraphQL server will start at `http://localhost:4000/graphql`

## Available Scripts

- `bun run dev` - Start the development server with hot reload
- `bun run gen` - Generate Prisma Client and Pothos types
- `bun run migrate:dev` - Run pending migrations and create new ones
- `bun run db:push` - Push schema changes directly (useful for prototyping)
- `bun run compose:up` - Start the Docker database
- `bun run compose:down` - Stop the Docker database

## Database Schema

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema definition.

### Schema Files

- [graphql/schema/builder.ts](src/graphql/schema/builder.ts) - Pothos schema builder configuration
- [graphql/schema/types/](src/graphql/schema/types/) - GraphQL type definitions

## Troubleshooting

### Database Connection Error

If you see a connection error:

1. Verify the database is running: `docker ps`
2. Check the `DATABASE_URL` in `.env` matches your setup
3. Restart the database: `bun run compose:down && bun run compose:up`

### Migrations Failed

If migrations fail:

```bash
# Reset the database (warning: deletes all data)
bunx prisma migrate reset

# Or push schema changes directly (faster for development)
bun run db:push
```

### Missing Types

If you get TypeScript errors about missing types:

```bash
# Regenerate all types
bun run gen
```

## Additional Resources

- [Pothos Documentation](https://pothos-graphql.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Yoga Documentation](https://the-guild.dev/graphql/yoga-server)
