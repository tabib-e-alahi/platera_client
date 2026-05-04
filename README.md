# Platera Client — Multi-Vendor Food Delivery Frontend

A production-minded Next.js frontend for Platera, a Bangladesh-focused multi-vendor food delivery platform connecting customers with restaurants, home kitchens, street food vendors, and shops.

> **Connected Repository:** This frontend consumes the Platera backend API.  
> **Backend Repository:** `[Add backend repo link here]`  
> **Frontend Live Demo:** `[Add frontend live URL here]`

---

## Problem Statement

Food delivery platforms are not only about showing menus. A serious system must manage different user roles, restaurant approvals, customer carts, city-based ordering, payment states, provider earnings, reviews, and protected dashboards without breaking the user experience.

The frontend challenge for Platera is to provide a clean customer-facing food discovery experience while also supporting operational dashboards for providers and admins. It needs to handle authentication, role-based routing, API communication, checkout, payment redirects, real-time order tracking, and responsive UI states in one connected application.

---

## Solution Overview

Platera Client is the frontend interface for a full-stack food marketplace. It uses Next.js App Router with a role-aware proxy layer, typed API services, reusable UI components, protected dashboards, and server/client data-fetching patterns.

The application supports:

- Public food discovery pages for restaurants, featured providers, top dishes, categories, testimonials, and restaurant details.
- Customer flows for registration, login, profile creation, cart management, checkout, payment status, order history, tracking, cancellation, and reviews.
- Provider flows for profile creation, approval request, dashboard statistics, meal/menu management, order handling, and review monitoring.
- Admin flows for dashboard analytics, provider approval, user management, category management, order/payment monitoring, settlements, support messages, and admin management.
- AI assistant support through a Gemini-powered in-app assistant route.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Shadcn UI, Radix UI, Tailwind CSS 4 |
| State/Data | TanStack Query, Axios, React hooks |
| Forms & Validation | React Hook Form, Zod |
| Animation | Framer Motion |
| Charts | Recharts |
| Auth Client | Better Auth client integration |
| Theme | next-themes, custom CSS variables |
| AI Assistant | Gemini API through Next.js API route |
| Package Manager | pnpm |

---

## Key Features

### Public User Experience

- Modern homepage with hero statistics, categories, featured restaurants, top dishes, testimonials, and AI assistant.
- Restaurant listing with filtering support by search, city, category, subcategory, and business type.
- Restaurant details page with meal filtering, dietary filtering, sorting, reviews, and add-to-cart actions.
- Static common pages including About and Contact.
- Responsive UI with reusable loading, carousel, card, button, sheet, tooltip, dropdown, skeleton, and form components.

### Authentication & Route Protection

- Customer and provider registration flows.
- Login and logout flows connected to backend auth APIs.
- Email verification page.
- Google OAuth callback route.
- Role-based route protection through `src/proxy.ts` and `src/handleProxy.ts`.
- Separate route handling for `CUSTOMER`, `PROVIDER`, `ADMIN`, and `SUPER_ADMIN`.
- Provider onboarding guard: providers without profiles are redirected to profile creation.
- Provider approval guard: unapproved providers are restricted to profile-only routes.
- Super-admin-only protection for admin management routes.

### Customer Features

- Customer dashboard.
- Customer profile management.
- Cart page with add, update quantity, remove item, and clear cart actions.
- Checkout flow with payment method support.
- Payment result pages for success, failure, and cancellation.
- Customer order list and order detail pages.
- Order tracking page connected to backend tracking APIs.
- Review creation and review eligibility checks.

### Provider Features

- Provider registration and profile creation with file upload support.
- Provider dashboard statistics.
- Menu management: add, edit, view, delete, and toggle meal availability.
- Provider order management.
- Provider profile management.
- Provider reviews dashboard.
- Provider statistics page.

### Admin Features

- Admin dashboard overview.
- Pending provider requests.
- Provider approval/rejection flow.
- Provider detail pages.
- User management and status toggling.
- Admin management for super-admin users.
- Category management.
- Order monitoring.
- Payment and settlement management.
- Support message management.

### AI Assistant

- Floating Platera Assistant component.
- Gemini API proxy route at `src/app/api/gemini/route.ts`.
- System instruction tailored to the Platera food delivery context.
- Suggested prompts for food discovery, order tracking, dietary options, and provider onboarding.

---

## Screenshots / GIFs

Add screenshots after deployment or local testing.

Suggested assets:

```txt
/screenshots/homepage.png
/screenshots/restaurants.png
/screenshots/restaurant-details.png
/screenshots/customer-dashboard.png
/screenshots/provider-dashboard.png
/screenshots/admin-dashboard.png
/screenshots/checkout-flow.gif
/screenshots/order-tracking.gif
```

Recommended README preview format:

```md
![Platera Homepage](./screenshots/homepage.png)
![Restaurant Details](./screenshots/restaurant-details.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## Project Structure

```txt
src/
├── app/
│   ├── (auth)/                 # Login, registration, verification, provider onboarding
│   ├── (commonLayouts)/        # Public pages, cart, checkout, restaurants
│   ├── (dashboardLayouts)/     # Admin, customer, and provider dashboard routes
│   └── api/gemini/             # Gemini proxy route for AI assistant
├── components/
│   ├── shared/                 # App-specific shared components
│   └── ui/                     # Shadcn/Radix UI primitives
├── constants/                  # Roles, role routes, Bangladesh districts
├── hooks/                      # Auth, mobile, toast, order tracking hooks
├── lib/                        # Axios, auth client, query client, utilities
├── providers/                  # Auth and TanStack Query providers
├── services/                   # API service layer
├── types/                      # Shared TypeScript types
├── utils/                      # Cookie extraction, image validation, protected routes
├── handleProxy.ts              # Main role-based route guard logic
└── proxy.ts                    # Next.js proxy entry
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone [add-frontend-repo-url]
cd platera-client-side
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```bash
cp .env .env.local
```

Then update the values based on your local or deployed backend.

### 4. Run the development server

```bash
pnpm dev
```

The frontend should run at:

```txt
http://localhost:3000
```

### 5. Build for production

```bash
pnpm build
pnpm start
```

---

## Environment Variables

Do not commit real secrets to GitHub. Keep production secrets inside the deployment platform environment settings.

```env
BETTER_AUTH_SECRET=your_better_auth_secret

NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:5000

GEMINI_API_KEY=your_gemini_api_key
```

### Variable Notes

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, usually ending with `/api/v1` |
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Backend root URL used by rewrites and auth proxying |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth backend URL |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL |
| `BETTER_AUTH_SECRET` | Auth secret. Keep private. |
| `GEMINI_API_KEY` | Server-side key for the Gemini assistant route |

---

## API / Architecture

The frontend talks to the backend through a typed service layer in `src/services`.

### Main Service Areas

| Service File | Responsibility |
|---|---|
| `auth.service.ts` | Login, logout, registration, session check, current user |
| `public.service.ts` | Categories, restaurants, featured restaurants, hero stats, top dishes |
| `restaurant.service.ts` | Restaurant listing and restaurant detail APIs |
| `cart.service.ts` | Cart read, add item, update quantity, remove item, clear cart |
| `customer.service.ts` | Customer profile APIs |
| `order.service.ts` | Checkout preview, order creation, customer/provider orders, tracking, cancellation |
| `payment.service.ts` | SSLCommerz payment initiation and payment status |
| `provider.service.ts` | Provider profile, approval request, meal/menu management, dashboard stats |
| `admin.service.ts` | Admin dashboard, providers, users, admins, orders, payments, settlements, categories |
| `review.service.ts` | Customer reviews, provider reviews, public meal/provider reviews |

### Request Flow

```txt
Browser
  ↓
Next.js App Router pages/components
  ↓
Service layer in src/services
  ↓
Axios instance / fetch
  ↓
Next.js rewrites or direct backend API URL
  ↓
Platera Backend API
```

### Auth Guard Flow

```txt
Incoming route request
  ↓
proxy.ts
  ↓
handleProxy.ts
  ↓
Check session cookie
  ↓
Call backend /auth/session-check
  ↓
Allow, redirect to login, or redirect to correct dashboard
```

---

## Live Demo & Credentials

Add only safe demo credentials here. Never expose real production admin credentials.

```txt
Frontend Live: [Add frontend deployment URL]
Backend API:   [Add backend deployment URL]

Customer Demo:
Email: [demo customer email]
Password: [demo password]

Provider Demo:
Email: [demo provider email]
Password: [demo password]

Admin Demo:
Email: [demo admin email]
Password: [demo password]
```

Recommended: create limited demo accounts and reset them regularly.

---

## Security Awareness

- Real API keys and auth secrets should stay in `.env.local` or deployment environment variables.
- The frontend does not directly expose payment credentials.
- Gemini key is used through a server route, not directly from client components.
- Protected pages are guarded through a route proxy and backend session verification.
- Admin and super-admin routes are separated in route protection logic.
- Axios sends cookies with `withCredentials: true` for session-based authentication.
- Auth-only pages redirect logged-in users away from login/register pages.

---

## Scalability Considerations

- Route-level separation keeps customer, provider, and admin dashboards maintainable.
- Service files isolate API communication from UI components.
- TanStack Query support allows better caching, refetching, loading states, and mutation handling.
- Server fetching with `revalidate` is used for public data such as featured restaurants and hero stats.
- UI primitives and shared components reduce duplication.
- Proxy-based access control keeps role routing consistent across dashboards.
- The architecture can support future modules such as delivery rider dashboards, coupon management, push notifications, and advanced analytics.

---

## Related Repository

This frontend requires the Platera backend API.

```txt
Backend Repository: [Add backend repo link here]
Backend Local URL:  http://localhost:5000
Backend API Base:   http://localhost:5000/api/v1
```

---

## Recruiter Notes

This frontend demonstrates practical full-stack product thinking, including:

- Role-based UX for customers, providers, admins, and super-admins.
- Protected routing with session validation.
- Real marketplace flows: discovery, cart, checkout, payment, order tracking, reviews, and settlements.
- Clean service-layer architecture instead of API calls scattered across components.
- Security awareness around cookies, environment variables, auth routing, and secret handling.
- Scalable dashboard structure suitable for a real operational product.
