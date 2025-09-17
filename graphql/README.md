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


### Running Tests

```bash
pnpm test
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm db:migrate` - Run database migrations (development)
- `pnpm db:generate` - Generate Prisma client
- `pnpm lint` - Run linting
- `pnpm fmt` - Format code

## Database Schema

The application uses Prisma ORM with SQLite. The database schema is defined in `prisma/schema.prisma`.

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