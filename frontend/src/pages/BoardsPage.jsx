import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/boards/SearchBar";
import CategoryFilter from "@/components/boards/CategoryFilter";
import BoardGrid from "@/components/boards/BoardGrid";
import CreateBoardModal from "@/components/boards/CreateBoardModal";
import { useBoards } from "@/context/BoardsContext";
import { RECENT_COUNT } from "@/data/categories";

export default function BoardsPage() {
  const { boards, createBoard, deleteBoard } = useBoards();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The boards shown in the grid are DERIVED from boards + category + search —
  // there is no separate filteredBoards state variable.
  const visibleBoards = useMemo(() => {
    let result = [...boards];

    if (activeCategory === "recent") {
      result = result
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, RECENT_COUNT);
    } else if (activeCategory === "mine") {
      // "My Boards" is a stretch placeholder — no auth yet, so show nothing.
      result = [];
    } else if (activeCategory !== "all") {
      result = result.filter((b) => b.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q));
    }

    return result;
  }, [boards, activeCategory, searchQuery]);

  return (
    <>
      {/* Banner */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Spread the Kudos 🎉
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Create themed boards and fill them with messages of praise,
            encouragement, and appreciation!
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="size-5" />
              Create a Board
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <SearchBar
            query={searchQuery}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {activeCategory === "mine" && (
          <p className="mt-6 rounded-lg border border-dashed bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            “My Boards” filters to your own boards once user accounts are added.
          </p>
        )}

        <div className="mt-8">
          <BoardGrid boards={visibleBoards} onDeleteBoard={deleteBoard} />
        </div>
      </section>

      <CreateBoardModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={createBoard}
      />
    </>
  );
}
