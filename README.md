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

- Next.js 16
- Postgres
- Drizzle ORM
- Better Auth
- Tailwind, ShadcnUI

# Custom Commands

- `npm run db:push` - drizzle push schema migration to database
- `npm run db:studio` - runs drizzle studio
- `npm run db:generate` - creates migration sql statement in `./drizzle`
- `npm run db:migrate` - applies migration sql statements
- `npm run test-production` - creates a production build and runs it

# ENV Setup

- DATABASE_URL={postgres connection string}
- NODE_ENV={development or production}
- BETTER_AUTH_SECRET={generated secret}
- BETTER_AUTH_URL={https://hosteddomain.com for example}
- GITHUB_CLIENT_ID={github oauth client id}
- GITHUB_CLIENT_SECRET={github oauth client secret}
- DISCORD_CLIENT_ID={discord oauth client id}
- DISCORD_CLIENT_SECRET={discord oauth client secret}
- GOOGLE_CLIENT_ID={google oauth client id}
- GOOGLE_CLIENT_SECRET={google oauth client secret}
