# planning

## Section 1: Component Architecture

Define every React component the app needs. For each component:

Responsibility: What does this component do? (one sentence)
Renders: What HTML elements or child components does it display?
Props: What data does it receive, and from where?
State: Does it manage any state? If so, what?
Interactions: What user actions does it handle?
Also document the parent-child hierarchy — which components render which.

## Section 2: API Contracts

Define every endpoint the frontend will consume. For each route:

Method and path (e.g., POST /boards)
Request body — field names, types, required vs. optional
Success response — shape and status code
Error responses — what cases trigger errors and what status codes they return
You should have contracts for boards CRUD, cards CRUD, upvoting, filtering, and search before writing any Express code.

## Section 3: Database Schema Spec

Define the Prisma models for Board and Card before touching schema.prisma. For each model:

Field names and data types
Required vs. optional fields
Relationships between models
Any default values or constraints
When you implement schema.prisma in Milestone 2, it should reflect this spec. If you change a field name or type during implementation, update the spec — don't just change the code silently.

## Section 4: State Architecture

Define what state the frontend needs to manage. For each state variable:

Data type and initial value
Which component owns it
What user action or event triggers an update


## Decisions Log — Frontend (Milestone 1)
- **Component that diverged most from the original spec**: [e.g., "BoardCard — originally planned as a single component, split into BoardCard + BoardCardActions after seeing how complex the interactions got"]
  **What I changed**: [...]
- **State variable I needed that wasn't in the original spec**: [e.g., "isModalOpen in App — hadn't thought about the create board modal at spec time"]
  **Which component owns it**: [...]
- **Prop that didn't match the API response shape and required adjustment**: [e.g., "board.imageUrl in spec, but backend returns board.image_url — updated state management to normalize on fetch"]