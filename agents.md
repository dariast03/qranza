# Coding Agent Guidelines

> Comprehensive guide for AI coding agents working with this supastarter codebase.

## Purpose

Use this document whenever generating or updating code in this repository. Mirror existing project conventions; do not invent new patterns without a strong reason.

---

## Technology Stack

You are an expert in:

- **TypeScript** – Strict typing, interfaces over type aliases
- **Node.js** – Server-side runtime (≥20)
- **TanStack Start** – Full-stack React framework with server functions and SSR
- **TanStack Router** – Type-safe file-based routing with loaders and guards
- **Vite** – Build tool and dev server
- **React** – Functional components, hooks
- **Shadcn-style UI & Base UI** – Accessible, composable primitives
- **Tailwind CSS** – Utility-first styling
- **oRPC** – Type-safe RPC layer
- **Better Auth** – Authentication with passkeys, magic links, organizations
- **Drizzle** – Database ORM (single source of truth, postgres by default)
- **TanStack Form + Zod** – Forms and validation (single form stack across saas + marketing)
- **TanStack Query** – Client-side data fetching and caching
- **use-intl** – Internationalization runtime and message access

---

## Architecture Overview

### Monorepo Structure

```
/
├── apps/
│   ├── marketing/               # Marketing site (public pages, blog, changelog)
│   │   ├── routes/              # TanStack Router routes (locale handled by shared URL rewrite helpers)
│   │   ├── modules/             # Feature modules
│   │   │   ├── home/            # Home page components
│   │   │   ├── blog/            # Blog components
│   │   │   ├── changelog/       # Changelog components
│   │   │   ├── shared/          # Cross-cutting components
│   │   │   └── analytics/       # Analytics providers
│   │   ├── content/             # MDX content (legal, blog posts)
│   │   ├── vite.config.ts       # Vite / TanStack Start config
│   │   └── tests/               # Playwright E2E tests
│   ├── saas/                    # SaaS application (protected app)
│   │   ├── routes/              # TanStack Router routes
│   │   │   ├── login/, signup/, forgot-password/, reset-password/, verify/ # Public auth routes
│   │   │   ├── _authenticated/  # Guarded layout (session check in beforeLoad)
│   │   │   │   └── _main/       # Inside the guarded shell (nav, sidebar, org selector)
│   │   │   └── api/             # Hono dispatcher (catch-all -> packages/api)
│   │   ├── vite.config.ts       # Vite / TanStack Start config
│   │   └── modules/             # Feature modules
│   │       ├── auth/            # Authentication components
│   │       ├── organizations/   # Organization management
│   │       ├── settings/        # User & account settings
│   │       ├── payments/        # Billing & subscriptions
│   │       ├── admin/           # Admin panel
│   │       ├── shared/          # Cross-cutting components
│   │       └── ...
│   ├── docs/                    # Documentation site (TanStack Start + fumadocs)
│   └── mail-preview/            # Email template preview (react-email)
├── packages/                    # Shared backend packages
│   ├── api/                     # oRPC procedures and HTTP handlers
│   ├── auth/                    # Better Auth configuration
│   ├── database/                # Drizzle schema and queries
│   ├── ai/                      # AI integrations
│   ├── i18n/                    # Translations and locale utilities
│   ├── logs/                    # Logging configuration
│   ├── mail/                    # Email providers and templates
│   ├── payments/                # Payment processing (Stripe, etc.)
│   ├── storage/                 # File storage (S3, etc.)
│   ├── ui/                      # Shadcn UI components
│   └── utils/                   # Shared utility functions
└── tooling/                     # Build tooling and shared configs
```

### Import Conventions

Use package exports instead of deep relative imports:

```typescript
// ✅ Good
import { auth } from "@repo/auth";
import { db } from "@repo/database";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui";
import { orpcClient } from "@shared/lib/orpc-client";
import { config } from "@config";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

// ❌ Bad
import { auth } from "../../../packages/auth/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
```

### Path Aliases

Path aliases are configured per app. Shared package aliases apply across the monorepo:

| Alias        | Path            |
| ------------ | --------------- |
| `@repo/*`    | `packages/*`    |
| `@repo/ui/*` | `packages/ui/*` |

**apps/saas** – SaaS application:

| Alias              | Path                                |
| ------------------ | ----------------------------------- |
| `@config`          | `apps/saas/config`                  |
| `@auth/`\*         | `apps/saas/modules/auth/*`          |
| `@organizations/*` | `apps/saas/modules/organizations/*` |
| `@settings/*`      | `apps/saas/modules/settings/*`      |
| `@payments/*`      | `apps/saas/modules/payments/*`      |
| `@admin/*`         | `apps/saas/modules/admin/*`         |
| `@ai/*`            | `apps/saas/modules/ai/*`            |
| `@onboarding/*`    | `apps/saas/modules/onboarding/*`    |
| `@shared/*`        | `apps/saas/modules/shared/*`        |
| `@i18n/*`          | `apps/saas/modules/i18n/*`          |

**apps/marketing** – Marketing site:

| Alias                 | Path                                            |
| --------------------- | ----------------------------------------------- |
| `@config`             | `apps/marketing/config`                         |
| `@analytics`          | `apps/marketing/modules/analytics`              |
| `@home/`\*            | `apps/marketing/modules/home/*`                 |
| `@blog/*`             | `apps/marketing/modules/blog/*`                 |
| `@changelog/*`        | `apps/marketing/modules/changelog/*`            |
| `@legal/*`            | `apps/marketing/modules/legal/*`                |
| `@shared/*`           | `apps/marketing/modules/shared/*`               |
| `@i18n/*`             | `apps/marketing/modules/i18n/*`                 |
| `content-collections` | `apps/marketing/.content-collections/generated` |

---

## Core Coding Principles

### TypeScript

- Write TypeScript everywhere; prefer interfaces over type aliases for object shapes
- Avoid enums; use maps/records or union literals instead
- Use functional components with TypeScript interfaces
- Export types alongside implementations when needed

```typescript
// ✅ Good
interface UserProps {
	name: string;
	email: string;
	isActive: boolean;
}

const USER_ROLES = {
	admin: "admin",
	user: "user",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// ❌ Bad
type UserProps = { name: string; email: string };
enum UserRole {
	Admin,
	User,
}
```

### Functions & Components

- Export React components as named functions; avoid default exports and classes
- Prefer pure functions declared with the `function` keyword
- Use descriptive camelCase identifiers (`isLoading`, `canSubmit`, `hasError`)
- Structure files: exported component, subcomponents, helpers, static content, types

```typescript
// ✅ Good
export function UserCard({ user }: UserCardProps) {
  const isActive = user.status === "active";
  return <div>{/* ... */}</div>;
}

function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

// ❌ Bad
export default class UserCard extends Component {}
```

### Naming Conventions

| Type                | Convention            | Example                     |
| ------------------- | --------------------- | --------------------------- |
| Directories         | lowercase with dashes | `components/auth-wizard`    |
| Components          | PascalCase            | `LoginForm.tsx`             |
| Variables/Functions | camelCase             | `isLoading`, `handleSubmit` |
| Constants           | SCREAMING_SNAKE_CASE  | `MAX_RETRIES`               |
| Types/Interfaces    | PascalCase            | `UserProps`, `AuthConfig`   |

---

## React & TanStack Start Patterns

### Server vs Client Components

TanStack Start does not use React Server Components or `"use client"` directives. Instead:

- **Server logic** uses `createServerFn` from `@tanstack/react-start/server` to run code exclusively on the server
- **Data loading** uses route `loader` functions that run on the server before rendering
- **Auth guards** and redirects use `beforeLoad` functions on routes
- All components are standard React components; there is no RSC boundary

```typescript
// Server function for server-only logic
import { createServerFn } from "@tanstack/react-start/server";

const getUser = createServerFn({ method: "GET" })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, data.userId),
    });
  });

// Route loader for data fetching
export const Route = createFileRoute("/$locale/users/$userId")({
  loader: async ({ params }) => {
    const user = await getUser({ data: { userId: params.userId } });
    return { user };
  },
  component: UserProfile,
});

function UserProfile() {
  const { user } = Route.useLoaderData();
  return <UserCard user={user} />;
}
```

### Minimize Client-Side State

- Minimize `useEffect` and `useState`; favor route loaders for data
- Use `nuqs` for URL search parameter state management
- Prefer server functions and route loaders over client-side data fetching

### Data Fetching

- Use `createServerFn` for server-side data access (database queries, secrets, etc.)
- Use route `loader` functions to load data before rendering
- Use `beforeLoad` for guards, auth checks, and redirects
- Colocate route-specific helpers under the route directory
- Share cross-route logic via `apps/[app]/modules` (e.g. `apps/saas/modules`, `apps/marketing/modules`)
- Use TanStack Query for client-side mutations and cache management

```typescript
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start/server";

const getSession = createServerFn({ method: "GET" }).handler(async () => {
	return await authClient.getSession();
});

export const Route = createFileRoute("/(authenticated)")({
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw redirect({ to: "/login" });
		}

		return { session };
	},
});
```

### Error Handling

- Use `throw notFound()` and `throw redirect()` from `@tanstack/react-router`
- Don't throw raw errors; handle them gracefully
- Use route `errorComponent` and `notFoundComponent` for error UI

```typescript
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start/server";

const getData = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await fetchById(data.id);
  });

export const Route = createFileRoute("/$locale/items/$id")({
  loader: async ({ params }) => {
    const data = await getData({ data: { id: params.id } });

    if (!data) {
      throw notFound();
    }

    if (!data.isAccessible) {
      throw redirect({ to: "/unauthorized" });
    }

    return { data };
  },
  component: ItemPage,
  notFoundComponent: () => <div>Item not found</div>,
});

function ItemPage() {
  const { data } = Route.useLoaderData();
  return <Content data={data} />;
}
```

---

## API & Data Layer

### oRPC Procedures

API logic lives in `packages/api/modules`. Structure procedures with:

1. Route metadata (method, path, tags)
2. Input validation with Zod
3. Middleware (auth, locale)
4. Handler implementation

```typescript
// packages/api/modules/[feature]/procedures/[action].ts
import { publicProcedure, protectedProcedure } from "../../../orpc/procedures";
import { z } from "zod";

export const createItem = protectedProcedure
	.route({
		method: "POST",
		path: "/items",
		tags: ["Items"],
		summary: "Create a new item",
	})
	.input(
		z.object({
			name: z.string().min(1),
			description: z.string().optional(),
		}),
	)
	.handler(async ({ input, context }) => {
		// Implementation
	});
```

### Procedure Types

- `publicProcedure` – No authentication required
- `protectedProcedure` – Requires authenticated session
- `adminProcedure` – Requires admin role

### Database Queries

- Use the generated database clients from `@repo/database`
- Never instantiate Drizzle `db` directly in app code (use query helpers from `@repo/database`)
- Keep queries in `packages/database/drizzle/queries/`

```typescript
// packages/database/drizzle/queries/users.ts
export async function getUserById(id: string) {
	return await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, id),
	});
}
```

### Client-Side Data Fetching

Use TanStack Query with oRPC utilities:

```typescript
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export function ItemsList() {
	const { data, isLoading } = useQuery(orpc.items.list.queryOptions());

	const createMutation = useMutation(orpc.items.create.mutationOptions());

	// ...
}
```

---

## Authentication & Authorization

### Session Handling

- Use helpers from `@repo/auth` for session handling
- Server-side: `getSession()` from `@auth/lib/auth-server.server`
- Client-side: `useSession()` hook from `@auth/hooks/use-session`

```typescript
// Server function
import { createServerFn } from "@tanstack/react-start/server";
import { getSession } from "@auth/lib/auth-server.server";

const loadSession = createServerFn({ method: "GET" }).handler(async () => {
	return await getSession();
});

// Client Component
import { useSession } from "@auth/hooks/use-session";

export function UserInfo() {
	const { user, loaded } = useSession();
	// ...
}
```

### Organization Scoping

- Respect organization scoping for multi-tenant features
- Access control helpers live in `apps/saas/modules/*/lib`
- Use `useActiveOrganization()` hook for organization context

```typescript
import { useActiveOrganization } from "@organizations/hooks/use-active-organization";

export function OrgSettings() {
  const { activeOrganization, isOrganizationAdmin } = useActiveOrganization();

  if (!isOrganizationAdmin) {
    return <p>Access denied</p>;
  }

  // ...
}
```

### Auth Flow Consistency

When updating auth flows, ensure:

- Email templates in `packages/mail/emails` are updated
- Audit hooks remain consistent
- Locale detection works correctly

---

## UI & Styling

### Component Library

- Use Shadcn UI components from `@repo/ui/components`
- Compose with Base UI primitives when customization is needed
- Import the `cn` helper for conditional class names

```typescript
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui";

export function CustomButton({ variant, className }: Props) {
  return (
    <Button className={cn("custom-styles", className)} variant={variant}>
      Click me
    </Button>
  );
}
```

### Tailwind CSS

- Follow mobile-first responsive utility ordering
- Respect design tokens from `tooling/tailwind/theme.css`
- Use consistent spacing and color variables

```typescript
// Mobile-first responsive design
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Content */}
</div>
```

### Image Optimization

- Use standard `<img>` tags with explicit `width`/`height` attributes
- Prefer WebP format when possible
- Implement lazy loading for non-critical visuals

```typescript
<img
  src="/images/hero.webp"
  alt="Hero image"
  width={1200}
  height={630}
  loading="lazy"
/>
```

---

## Forms & Validation

### Form Implementation

- Use `@tanstack/react-form` for form state management.
- Use `zod` for schema validation (passed via `validators: { onSubmit: schema }`
  — zod 4 is a Standard Schema, no adapter package needed).
- Render submit state via `useStore(form.store, (s) => s.isSubmitting)` etc.
- Root-level errors set with `formApi.setErrorMap({ onSubmit: { form: "..." } })`
  are rendered by the banner `<Alert>` above the form; read them via the
  `formatFormRootError(useStore(form.store, (s) => s.errors))` helper from
  `@repo/ui/components/form-root-error`.
- Reuse the shadcn-style primitives in `@repo/ui/components/form`.

```typescript
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export function ContactForm() {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      // Handle submission
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <Form form={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FormField name="name">
          {(field) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </FormField>
        {/* More fields... */}
        <Button type="submit" loading={isSubmitting}>Submit</Button>
      </form>
    </Form>
  );
}
```

### Shared Validation Schemas

- Define validation schemas in API module types for reuse
- Import schemas from `@repo/api/modules/[feature]/types`

```typescript
// packages/api/modules/contact/types.ts
import { z } from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	message: z.string().min(10),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
```

---

## Internationalization

### Translation Strings

- Source strings via i18n utilities in `packages/i18n`.
- Keep translations scoped by surface: `marketing`, `saas`, `mail`, and
  `shared`. Shared messages are merged into each app surface, and missing
  translations fall back to the default locale.
- Use `useTranslations`, `useFormatter`, and `IntlProvider` from `use-intl`
  for React UI. The SaaS app re-exports these hooks from `@i18n/intl` for
  existing local imports.
- For non-React server usage such as email templates, use helpers built on
  `createTranslator` from `use-intl/core`.
- Content collections live in `apps/marketing/content`.

```typescript
import { useTranslations } from "use-intl";
const t = useTranslations("settings.account");
<h1>{t("general")}</h1>;
```

### Locale Handling

- Honor locale detection from `packages/i18n/config.ts`.
- Locale prefixes are handled by shared `@repo/i18n` URL helpers. The router's
  `rewrite` hook de-/localizes every URL, and each app's `server.ts` runs
  custom middleware for default-locale redirects and cookie sync.
- Read the active locale in components or loaders with `getCurrentLocale()`
  from `@repo/i18n/runtime`.
- Use correct cookie naming conventions (`locale`).
- For email templates (server-only), use the mail translator helper in
  `packages/mail/lib/i18n.ts`.

---

## Configuration

### Config files

Each package and application has its own config file to keep the config scoped.

If you need to access the config from a package, you can import it directly from the packages config file.

```typescript
import { config } from "@config";
import { config as i18nConfig } from "@repo/i18n";

// Access configuration
config.appName; // Application name
i18nConfig.defaultLocale; // Default locale
```

### Environment Variables

- Server-only variables: No prefix
- Client-accessible variables: `VITE_` prefix (accessed via `import.meta.env.VITE_*`)
- With the split apps, prefer SaaS-specific public URLs such as `VITE_SAAS_URL` for auth and app redirects
- Payment provider identifiers should stay server-only where possible; avoid exposing provider `priceId` values to the client unless the existing implementation already does
- Never commit secrets; use `.env.local`

---

## Tooling & Quality

### Package Manager

- Use **pnpm** for package management
- Run workspace-wide commands via **Turbo**

```bash
pnpm dev      # Start development server (via turbo)
pnpm build    # Build all packages (output goes to .output/)
pnpm lint     # Run Oxlint
pnpm format   # Format with Oxfmt
pnpm verify   # Oxlint + Oxfmt check (CI-style)
```

### Code Quality

- Linting and formatting use **Oxlint** and **Oxfmt**
- Keep files clean (run `pnpm verify` before committing)
- Target Node.js ≥ 20 with ESM-compatible imports

### Testing

- E2E tests use **Playwright** in `apps/marketing/tests` and `apps/saas/tests`
- Run tests with `pnpm test` from the app directory or workspace root

### Adding Dependencies

- Add dependencies at the correct workspace package
- Prefer the workspace `catalog:` versions in `pnpm-workspace.yaml` when the dependency is already managed there
- Wire up exports through the relevant `index.ts`
- Use the latest stable versions

---

## Performance Optimization

### Core Web Vitals

Optimize for LCP, CLS, and FID:

- Use route-level code splitting (TanStack Router handles this automatically per route)
- Use `React.lazy()` for non-critical components within a route
- Implement proper image optimization
- Avoid layout shifts with proper sizing

```typescript
import { lazy, Suspense } from "react";

const HeavyChart = lazy(() => import("./HeavyChart"));

export function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Component Guidelines

Keep components focused and performant:

- Move server-only logic into `createServerFn` or route loaders
- Use TanStack Query for client-side cache management
- Keep interactive components small and focused
- Avoid unnecessary re-renders with proper memoization

---

## Documentation & Change Management

### Documentation Updates

- Update relevant MDX docs under `apps/marketing/content` when altering user-facing behavior
- Update `agents.md` when architectural conventions, app boundaries, aliases, or shared workflows change
- Keep README files current with setup instructions

### Changelog

- Log noteworthy changes in `CHANGELOG.md` for consumer-impacting changes
- Follow conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`

---

## Best Practices Summary

### When Adding Features

1. Inspect neighboring files for patterns before writing new code
2. Prefer incremental, well-scoped changes over sweeping rewrites
3. Ensure new features have corresponding server and client stories (UI, API, data layer, emails if needed)
4. Test the feature locally before considering it complete

### Code Review Checklist

- TypeScript types are accurate and complete
- No `any` types without justification
- Server logic uses `createServerFn` or route loaders
- Forms use @tanstack/react-form + zod
- API procedures follow existing patterns
- Translations added for user-facing strings
- Mobile-first responsive design
- Accessibility considered (Base UI primitives)
- No console.log statements in production code
- Oxlint linting passes

### When in Doubt

- Inspect neighboring files for patterns before writing new code
- Ask for clarification on product requirements rather than guessing
- Prefer incremental, well-scoped changes over sweeping rewrites
- Follow the official documentation at [supastarter.dev/docs](https://supastarter.dev/docs)
