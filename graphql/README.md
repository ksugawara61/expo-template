# GraphQL API Server

## Development Setup

### Prerequisites
- Node.js (>=18)
- pnpm
- Docker & Docker Compose

### Installation
```bash
pnpm install
```

### Database Setup

#### Development Database
```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
```

#### Test Database
```bash
# Start test PostgreSQL container
pnpm test:db:up

# Run migrations on test database
pnpm db:migrate:test

# Stop test database
pnpm test:db:down
```

### Running Tests

#### Run tests with temporary database
```bash
# This will start DB, run migrations, execute tests, and cleanup
pnpm test:with:db
```

#### Manual test setup
```bash
# Start test database
pnpm test:db:up

# Run migrations
pnpm db:migrate:test

# Run tests
pnpm test

# Clean up
pnpm test:db:down
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:with:db` - Run tests with automatic DB setup/teardown
- `pnpm test:db:up` - Start test database container
- `pnpm test:db:down` - Stop test database container
- `pnpm test:db:reset` - Reset test database
- `pnpm db:migrate` - Run database migrations (development)
- `pnpm db:migrate:test` - Run database migrations (test)
- `pnpm db:generate` - Generate Prisma client
- `pnpm lint` - Run linting
- `pnpm fmt` - Format code

## Database Schema

The application uses Prisma ORM with PostgreSQL. The database schema is defined in `prisma/schema.prisma`.

### Bookmarks Model
```prisma
model Bookmark {
  id          String   @id @default(cuid())
  title       String
  url         String
  description String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  @@map("bookmarks")
}
```