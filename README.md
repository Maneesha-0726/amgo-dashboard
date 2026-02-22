# AMGO Frontend Engineering Assessment

A production-style React dashboard for managing marketing campaigns with analytics, settings, and simulated backend behavior.

Enterprise SaaS Dashboard built with:

- React + Vite
- TypeScript
- Tailwind CSS
- Feature-based architecture
- Fully frontend simulated APIs

## Features

- Campaign Management (search, sort, pagination, bulk actions)
- Optimistic status updates
- Campaign Detail Page with tabs
- Overview editable form with unsaved change detection
- Assets upload simulation
- Performance metrics visualization
- Job lifecycle simulation (pending → processing → completed/failed)

## Architecture

- src/features → domain modules  
- src/shared → reusable components, services, types  
- fakeApi simulates backend behavior  

## Run Locally

```bash
npm install
npm run dev