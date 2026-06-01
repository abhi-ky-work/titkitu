# Add Ticket Type Modal Flow

This plan outlines the steps to introduce a reusable modal system and specifically implement an "Add Ticket Type" modal for the event creation page. 

## Open Questions

> [!WARNING]
> Before proceeding, please clarify the following:
> 1. **Data Structure:** Currently, tickets in `create-event/page.tsx` have `name`, `price`, and `quantity`. When the user selects a category (e.g., "Girls", "Couples", "Standard"), should we map this category to the `name` field, or should we introduce a new `category` field in the ticket type object?
> 2. **Component Architecture:** We currently have `@radix-ui/react-dialog` in `package.json`. I plan to use Shadcn UI's `Dialog` component as the base. Do you want me to add it via `npx shadcn-ui@latest add dialog` or just create a custom wrapper using Radix UI?
> 3. **Modal Folder Structure:** I propose placing domain-specific modals (like the Add Ticket Type modal) in `src/components/modals/`. Does this structure work for you?

## Proposed Changes

### Component Infrastructure

#### [NEW] `src/components/ui/dialog.tsx`
- We will set up the foundational Dialog component using Shadcn UI / Radix UI to ensure accessibility and consistent styling across the app. This will serve as the base for all modals.

### Domain Modals

#### [NEW] `src/components/modals/AddTicketTypeModal.tsx`
- **Purpose**: A descriptive, reusable modal template for adding ticket types.
- **Form Fields**:
  - **Ticket Category**: A select dropdown or segmented control with options like "Girls", "Couples", "Standard".
  - **Price**: Input for the ticket price.
  - **Quantity**: Input for the total number of tickets available for this type.
- **Behavior**: Will take an `onAddTicket(ticket)` prop to pass the newly created ticket back to the parent component, and an `isOpen` / `onClose` prop to manage visibility.

### Page Implementation

#### [MODIFY] `src/app/(protected)/dashboard/create-event/page.tsx`
- **State Management**: Add a `isTicketModalOpen` boolean state to control the modal's visibility.
- **UI Update**: Replace the default inline action of the "Add Another Ticket Type" button so it opens the `AddTicketTypeModal` instead of instantly pushing an empty ticket to the array.
- **Integration**: Embed the `<AddTicketTypeModal />` in the page. When the modal fires `onAddTicket`, it will append the new ticket (with category, price, and quantity) to the existing `formData.ticketTypes` array.

## Verification Plan

### Manual Verification
- Navigate to the Create Event page in the browser.
- Click the "Add Another Ticket Type" button and verify that a modal pops up.
- Fill out the modal with a specific category, price, and quantity, and click Add.
- Verify the modal closes and the new ticket correctly appears in the "Ticket Types" section on the page.
- Test closing the modal without saving to ensure it dismisses properly without affecting data.
