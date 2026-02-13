# Rate My Plate

Review and rate people based upon their driving. It's all tied to the license plate and state for each vehicle.

<p align="center">
      <img src="./images/version1.1/homepage.png" align="left">
      <img src="./images/version1.1/plate.png" align="right">
</p>
<p align="center">
      <img src="./images/version1.1/login-dialog.png" align="left">
      <img src="./images/version1.1/dashboard.png" align="right">
</p>
<p align="center">
      <img src="./images/version1.1/plates-table.png" align="left">
      <img src="./images/version1.1/login-screen.png" align="right">
</p>

# Tech Stack

- Next.js 14
- Postgres
- Drizzle ORM
- Better Auth (OAuth authentication)
- Tailwind, ShadcnUI

# Custom Commands

- `npm run db:push` - drizzle push schema migration to database
- `npm run db:studio` - runs drizzle studio
- `npm run db:generate` - creates migration sql statement in `./drizzle`
- `npm run db:migrate` - applies migration sql statements
- `npm run db:migrate-auth` - runs auth migration script (NextAuth to Better Auth)
- `npm run test-production` - creates a production build and runs it

# ENV Setup

See `.env.example` for a complete list of required environment variables.

## Required Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ratemyplate
NODE_ENV=development

# Better Auth
BETTER_AUTH_SECRET=<generate with: npx @better-auth/cli secret>
BETTER_AUTH_URL=http://localhost:3000  # or your production URL

# OAuth Providers
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
DISCORD_CLIENT_ID=<your-discord-client-id>
DISCORD_CLIENT_SECRET=<your-discord-client-secret>
```

## OAuth Provider Setup

You need to configure OAuth applications for each provider:

1. **GitHub**: Create an OAuth App at [GitHub Settings](https://github.com/settings/developers)
2. **Google**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. **Discord**: Create an application at [Discord Developer Portal](https://discord.com/developers/applications)

For each provider, set the callback URL to:
- Development: `http://localhost:3000/api/auth/callback/{provider}`
- Production: `https://yourdomain.com/api/auth/callback/{provider}`

Where `{provider}` is `github`, `google`, or `discord`.

## Migration Note

If migrating from NextAuth v5, see [MIGRATION.md](./MIGRATION.md) for detailed instructions.
