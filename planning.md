# Kudos Board — planning.md

## Section 1: Component Architecture

### Component Hierarchy

```text
App
├── Header
├── BoardsPage (route: "/")
│   ├── SearchBar
│   ├── CategoryFilter
│   ├── BoardGrid
│   │   └── BoardCard        (one per board)
│   └── CreateBoardModal     (toggled)
├── BoardDetailPage (route: "/boards/:boardId")
│   ├── CardGrid
│   │   └── KudosCard        (one per card)
│   └── CreateCardModal      (toggled)
└── Footer
```

### Component Specs

#### `App`

- **Responsibility:** Top-level shell — sets up routing and wraps the app in shared providers.
- **Renders:** `Header`, the route outlet (`BoardsPage` or `BoardDetailPage`), `Footer`.
- **Props:** none.
- **State:** none (route is owned by the router).
- **Interactions:** none directly; delegates to routed pages.

#### `Header`

- **Responsibility:** Persistent top banner with the app title and a link back to the home page.
- **Renders:** Banner/logo, app title, home link.
- **Props:** none.
- **State:** none.
- **Interactions:** Clicking the title/logo navigates to `/`.

#### `BoardsPage`

- **Responsibility:** Home/dashboard — fetches and displays all boards, owns search/filter/create state.
- **Renders:** `SearchBar`, `CategoryFilter`, `BoardGrid`, `CreateBoardModal`, a "Create Board" button.
- **Props:** none.
- **State:** `boards`, `searchQuery`, `activeCategory`, `isBoardModalOpen`, `isLoading`, `error` (see Section 4).
- **Interactions:** Fetches boards on mount; opens the create-board modal; deletes a board; passes the
  derived (filtered + searched) board list down to `BoardGrid`.

#### `SearchBar`

- **Responsibility:** Lets the user search boards by title.
- **Renders:** Text input, Search/submit button, Clear button.
- **Props:** `searchQuery: string`, `onSearchChange(value)`, `onSubmit()`, `onClear()` — all from BoardsPage.
- **State:** none (controlled by `searchQuery` in BoardsPage), or a local draft string if debounced.
- **Interactions:** Typing updates the query; pressing Enter or clicking Search applies it; Clear empties
  the input so all boards show again.

#### `CategoryFilter`

- **Responsibility:** Lets the user filter boards by category.
- **Renders:** Buttons/tabs: All, Recent, Celebration, Thank You, Inspiration.
- **Props:** `activeCategory: string`, `onCategoryChange(category)` — from BoardsPage.
- **State:** none.
- **Interactions:** Clicking a category sets `activeCategory`; "Recent" shows the 6 most recently created boards.

#### `BoardGrid` / `BoardCard`

- **Responsibility:** `BoardGrid` lays out the boards in a responsive grid; `BoardCard` displays one board.
- **Renders:** `BoardGrid` → list of `BoardCard`. `BoardCard` → image/gif, board title, category, optional
  author, "View Board" link, Delete button.
- **Props:** `BoardGrid`: `boards: Board[]`, `onDeleteBoard(id)`. `BoardCard`: `board: Board`, `onDelete(id)`.
- **State:** none.
- **Interactions:** Clicking a card (or "View Board") navigates to `/boards/:boardId`; clicking Delete
  removes the board.

#### `CreateBoardModal`

- **Responsibility:** Form to create a new board.
- **Renders:** Modal with inputs for title (required), category (required), image URL (required), author
  (optional); Submit and Cancel buttons.
- **Props:** `isOpen: boolean`, `onClose()`, `onCreate(boardData)` — from BoardsPage.
- **State:** Local form fields and validation/error messages.
- **Interactions:** Validates required fields; on submit calls `onCreate` (POST), closes on success, shows
  errors on failure.

#### `BoardDetailPage`

- **Responsibility:** Shows one board and all its cards; owns card-related state.
- **Renders:** Board title/header, `CardGrid`, `CreateCardModal`, an "Add Card" button.
- **Props:** none (reads `boardId` from the route params).
- **State:** `currentBoard`, `cards`, `isCardModalOpen`, `isLoading`, `error` (see Section 4).
- **Interactions:** Fetches board + cards on mount; opens add-card modal; upvotes a card; deletes a card.

#### `CardGrid` / `KudosCard`

- **Responsibility:** `CardGrid` lays out the cards; `KudosCard` displays one card.
- **Renders:** `CardGrid` → list of `KudosCard`. `KudosCard` → message, gif, upvote count + upvote button,
  optional author, Delete button.
- **Props:** `CardGrid`: `cards: Card[]`, `onUpvote(id)`, `onDelete(id)`. `KudosCard`: `card: Card`,
  `onUpvote(id)`, `onDelete(id)`.
- **State:** none.
- **Interactions:** Clicking upvote increments the count (PATCH); clicking Delete removes the card.

#### `CreateCardModal`

- **Responsibility:** Form to add a card to the current board.
- **Renders:** Modal with a text message input (required), a GIF search/select (required), author (optional);
  Submit and Cancel buttons.
- **Props:** `isOpen: boolean`, `boardId`, `onClose()`, `onCreate(cardData)` — from BoardDetailPage.
- **State:** Local form fields, the selected gif URL, validation/error messages.
- **Interactions:** Validates required fields; on submit calls `onCreate` (POST), closes on success.

#### `Footer`

- **Responsibility:** Static footer.
- **Renders:** Attribution / links text.
- **Props:** none.
- **State:** none.
- **Interactions:** none.

### Stretch Components

> Add these only when adopting the corresponding stretch feature.

- **`GiphySearch`** — used inside `CreateCardModal`; searches the GIPHY API and lets the user pick a gif.
  Props: `onSelect(gifUrl)`. State: search query, results, selected gif.
- **`CommentsModal`** — pop-up showing a card's message, gif, author, and its comments, plus a form to add
  a comment. Props: `card`, `comments`, `isOpen`, `onClose()`, `onAddComment(body, author)`.
- **`ThemeToggle`** — light/dark toggle shown in the Header. Props: `theme`, `onToggle()`.
- **`Login` / `Signup`** — auth forms. Props: `onSubmit(credentials)`.

---

## Section 2: API Contracts

> Every endpoint the frontend consumes. Base URL in dev: `http://localhost:3000`. Covers boards CRUD,
> cards CRUD, upvoting, filtering, and search.

### Boards

#### `GET /boards`

- **Filtering / search:** `?category=` (`all` | `recent` | `celebration` | `thank-you` | `inspiration`),
  `?search=` (matches board title, case-insensitive). `recent` returns the 6 most recently created boards.
- **Request body:** none.
- **Success:** `200 OK` → `Board[]`.
- **Errors:** `500` server error.

#### `GET /boards/:id`

- **Request body:** none.
- **Success:** `200 OK` → `Board` (including its `cards`).
- **Errors:** `404` board not found.

#### `POST /boards`

- **Request body:**
  - `title` — string, **required**
  - `category` — string, **required** (one of the four categories)
  - `imageUrl` — string, **required**
  - `author` — string, optional
- **Success:** `201 Created` → the created `Board`.
- **Errors:** `400` missing/invalid required field.

#### `DELETE /boards/:id`

- **Request body:** none.
- **Success:** `200 OK` → the deleted `Board`. (Cascade-deletes the board's cards.)
- **Errors:** `404` not found.

### Cards

#### `GET /boards/:boardId/cards`

- **Request body:** none.
- **Success:** `200 OK` → `Card[]` for that board.
- **Errors:** `404` board not found.

#### `POST /boards/:boardId/cards`

- **Request body:**
  - `message` — string, **required**
  - `gifUrl` — string, **required** (selected via GIPHY)
  - `author` — string, optional
- **Success:** `201 Created` → the created `Card`.
- **Errors:** `400` missing required field, `404` board not found.

#### `PATCH /cards/:id/upvote`

- **Request body:** none.
- **Success:** `200 OK` → the updated `Card` (with `upvotes` incremented by 1).
- **Errors:** `404` not found.

#### `DELETE /cards/:id`

- **Request body:** none.
- **Success:** `200 OK` → the deleted `Card`.
- **Errors:** `404` not found.

### Stretch Endpoints

> Add when adopting the corresponding stretch feature.

- **`GET /cards/:id/comments`** → `200 OK` → `Comment[]`.
- **`POST /cards/:id/comments`** — body: `message` (required), `author` (optional) → `201 Created` → `Comment`.
- **`PATCH /cards/:id/pin`** — toggles pin status → `200 OK` → updated `Card`.
- **`POST /auth/signup`** — body: `username`, `password` → `201 Created` → `User` (no password).
- **`POST /auth/login`** — body: `username`, `password` → `200 OK` → session/token.

### Standard Error Shape

```json
{ "error": "Human-readable message" }
```

---

## Section 3: Database Schema Spec

> Prisma models for `Board` and `Card`, defined before writing `schema.prisma`.

### `Board`

- **`id`** — Int, **required**, `@id @default(autoincrement())`, primary key
- **`title`** — String, **required**
- **`category`** — String, **required** (one of: celebration, thank-you, inspiration; "recent"/"all" are
  filters, not stored values)
- **`imageUrl`** — String, **required**
- **`author`** — String, optional
- **`createdAt`** — DateTime, **required**, `@default(now())` (used for the "recent" filter)
- **`cards`** — `Card[]` relation

### `Card`

- **`id`** — Int, **required**, `@id @default(autoincrement())`, primary key
- **`message`** — String, **required**
- **`gifUrl`** — String, **required**
- **`author`** — String, optional
- **`upvotes`** — Int, **required**, `@default(0)`
- **`boardId`** — Int, **required**, foreign key → `Board`
- **`board`** — `Board` relation, `onDelete: Cascade`
- **`createdAt`** — DateTime, **required**, `@default(now())`
- **`pinned`** — Boolean, `@default(false)` _(stretch: pinned cards)_
- **`pinnedAt`** — DateTime, optional _(stretch: orders pinned cards, most recent first)_

### Relationships & Constraints

- `Board` 1 ──< many `Card`. Deleting a board cascade-deletes its cards (`onDelete: Cascade`).

### Stretch Models

> Add when adopting the corresponding stretch feature.

- **`Comment`** — `id` (Int, PK), `message` (String, required), `author` (String, optional),
  `cardId` (Int, FK → Card, `onDelete: Cascade`), `createdAt` (DateTime, `@default(now())`).
- **`User`** — `id` (Int, PK), `username` (String, required, unique), `password` (String, hashed,
  required). Add optional `userId` FKs on `Board` and `Card` so guest/anonymous content is still allowed.

---

## Section 4: State Architecture

> State the frontend manages. For each: data type + initial value, owning component, and update trigger.

- **`boards`** — `Board[]`, initial `[]`, owned by **BoardsPage**. Updated on: fetch on mount; create/delete board.
- **`searchQuery`** — `string`, initial `""`, owned by **BoardsPage**. Updated on: user types in / clears the search input.
- **`activeCategory`** — `string`, initial `"all"`, owned by **BoardsPage**. Updated on: user clicks a filter category.
- **`isBoardModalOpen`** — `boolean`, initial `false`, owned by **BoardsPage**. Updated on: user opens/closes the create-board modal.
- **`currentBoard`** — `Board | null`, initial `null`, owned by **BoardDetailPage**. Updated on: fetch when the detail route loads.
- **`cards`** — `Card[]`, initial `[]`, owned by **BoardDetailPage**. Updated on: fetch; create/upvote/delete card.
- **`isCardModalOpen`** — `boolean`, initial `false`, owned by **BoardDetailPage**. Updated on: user opens/closes the add-card modal.
- **`isLoading`** — `boolean`, initial `false`, owned by **each page** (BoardsPage, BoardDetailPage). Updated on: before/after a fetch.
- **`error`** — `string | null`, initial `null`, owned by **each page**. Updated on: an API call fails.

**Derived state (not stored):** the boards actually shown in the grid are computed from `boards` +
`activeCategory` + `searchQuery` — there is no separate `filteredBoards` state variable.

### Stretch State

> Add when adopting the corresponding stretch feature.

- **`theme`** — `"light" | "dark"`, initial `"light"`, owned by **App** (provided via context, persisted to localStorage). Updated on: user clicks the theme toggle.
- **`currentUser`** — `User | null`, initial `null`, owned by **App** (auth context). Updated on: login/logout.
- **`comments`** — `Comment[]`, initial `[]`, owned by **CommentsModal/KudosCard**. Updated on: fetch; add comment.

---

## Decisions Log — Frontend (Milestone 1)

> Fill in after building the frontend components.

- **Component that diverged most from the original spec:** _[...]_
  **What I changed:** _[...]_
- **State variable I needed that wasn't in the original spec:** _[...]_
  **Which component owns it:** _[...]_
- **Prop that didn't match the API response shape and required adjustment:** _[...]_

---

## Spec Reconciliation — Backend (Milestone 2)

> Fill in after building the backend.

### Endpoints verified

- `GET /boards` — _[✅ matches spec / ⚠️ gap: ...]_
- `POST /boards` — _[✅ / ⚠️ gap: ...]_
- `DELETE /boards/:id` — _[✅ / ⚠️ gap: ...]_
- `GET /boards/:id/cards` — _[✅ / ⚠️ gap: ...]_
- `POST /cards` — _[✅ / ⚠️ gap: ...]_
- `PATCH /cards/:id/upvote` — _[✅ / ⚠️ gap: ...]_
- `DELETE /cards/:id` — _[✅ / ⚠️ gap: ...]_

### Schema verified against spec

- Board model fields match schema spec: _[✅ / ⚠️ field that changed: ...]_
- Card model fields match schema spec: _[✅ / ⚠️ field that changed: ...]_
- Relationship (Board → Cards) correct: _[✅ / ⚠️ ...]_

### Gaps found and resolved

- _[...]_

### Intentional spec updates made during backend implementation

- _[...]_

---

## Final Spec Reconciliation — Full Pipeline (Milestone 3)

> Fill in after connecting frontend and backend.

### Frontend fetch calls verified against API contracts

- `GET /boards` (home page load): _[✅ / ⚠️ gap: ...]_
- `POST /boards` (create board): _[✅ / ⚠️ gap: ...]_
- `DELETE /boards/:id`: _[✅ / ⚠️ gap: ...]_
- `GET /boards/:id/cards`: _[✅ / ⚠️ gap: ...]_
- `POST /cards`: _[✅ / ⚠️ gap: ...]_
- `PATCH /cards/:id/upvote`: _[✅ / ⚠️ gap: ...]_
- `DELETE /cards/:id`: _[✅ / ⚠️ gap: ...]_

### Integration gaps found and resolved

- _[...]_

### State architecture verified

- State variables match actual component implementation: _[✅ / ⚠️ differences: ...]_

### Final code-spec parity assessment

- Is this spec an accurate description of the system as built? _[✅ Yes / ⚠️ Remaining intentional divergences: ...]_
