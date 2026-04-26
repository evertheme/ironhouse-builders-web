This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment variables

Create `.env.local` with:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (public site + admin) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for contact form | Service role key (server only). Used to insert contact submissions and to list Auth users for email notifications. Never expose to the client. |
| `RESEND_API_KEY` | For contact emails | [Resend](https://resend.com) API key (server only) |
| `CONTACT_NOTIFICATION_FROM` | For contact emails | Verified sender, e.g. `Iron House <onboarding@resend.dev>` in development or your domain in production |
| `CONTACT_NOTIFICATION_TO` | Recommended | Comma-separated addresses merged with Supabase Auth user emails. **With Resend’s test sender (`onboarding@resend.dev`), delivery is often limited**—set this to an address Resend allows (e.g. your Resend account email) so notifications arrive. |

**Resend:** Free tier includes 3,000 emails/month and a 100 emails/day cap (see [pricing](https://resend.com/pricing)). Install is `npm install resend` (already in this repo). Verify your domain in production before using a custom `From` address.

**Contact messages table:** Run `supabase/migrations/20250426120000_contact_messages.sql` in the Supabase SQL editor (or via CLI) so the contact API and admin inbox can persist rows.

**Contact email not arriving:** Confirm `RESEND_API_KEY` and `CONTACT_NOTIFICATION_FROM` are set on the server (e.g. Vercel env). Submit the form again and check the deployment logs for lines starting with `[contact]` (`no_api_key`, `no_recipients`, `Resend error`, or `listUsers failed`). If the DB row is created but mail never arrives, `no_recipients` or Resend rejecting `to` addresses is the usual cause—use `CONTACT_NOTIFICATION_TO` and/or a verified domain.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
