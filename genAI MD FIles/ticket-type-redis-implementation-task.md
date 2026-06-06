# Ticket Types & Redis Implementation Tasks

- `[x]` 1. Frontend Modifications
  - `[x]` Update `create-event/page.tsx` to format `price` and `quantity` as numeric types before API submission
- `[x]` 2. Backend Schema Modifications
  - `[x]` Add `TicketTypeInventory` to `booking/prisma/schema.prisma`
  - `[x]` Update `Booking` and `Ticket` models in `booking/prisma/schema.prisma`
  - `[x]` Run prisma migrations
- `[x]` 3. Partner Service Logic
  - `[x]` Parse string fields to number if they aren't already parsed in `events.service.ts`
  - `[x]` Update `booking-client.service.ts` to include ticket types in the inventory payload
- `[x]` 4. Booking Service Logic & Redis Integration
  - `[x]` Create endpoint to receive and initialize `TicketTypeInventory`
  - `[x]` Review existing Redis module in Booking service
  - `[x]` Implement Lua script for atomic booking decrements
  - `[x]` Update the booking flow to utilize Redis Lua script before DB confirmation
- `[x]` 5. Provide local Redis setup steps
