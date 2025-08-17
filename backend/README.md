# WriteFlow Backend

This is the backend repository for **WriteFlow**, built with Node.js, Express, TypeScript, and Drizzle ORM.

## Features

- TypeScript-first backend setup
- Express server (scaffolded, ready for API development)
- Prisma ORM for database management
- Environment variable management with dotenv
- Relational schema for users, blogs, comments, tags, analytics, and more

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory.
   - Add your database and other secrets present in `.env.example`.

### Development

To build and run the backend in development mode:

```bash
npm run dev
```

This will compile the TypeScript code and start the server from the `dist` directory.

### Project Structure

```
backend/
  ├── src/            # Source TypeScript files
  ├── dist/           # Compiled JavaScript output
  ├── package.json    # Project metadata and scripts
  ├── tsconfig.json   # TypeScript configuration
  └── .env            # Environment variables (not committed)
```

### Scripts

- `npm run dev` — Build TypeScript and run the server
- `npm test` — Placeholder for tests

### Dependencies

- express
- dotenv
- typescript
- @types/express

### Dev Dependencies

- tsx

## License

This project is licensed under the ISC License.
