import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type LabScenarioSelectorItem = {
  id: string;
  name: ReactNode;
};

type LabScenarioSelectorProps<TItem extends LabScenarioSelectorItem> = {
  items: readonly TItem[];
  activeId: string;
  onSelect: (itemId: string) => void;
};

export default function LabScenarioSelector<TItem extends LabScenarioSelectorItem>({
  items,
  activeId,
  onSelect,
}: LabScenarioSelectorProps<TItem>) {
  return (
    <>
      {items.map((item) => (
        <Button
          key={item.id}
          className="h-auto max-w-full whitespace-normal break-words text-left"
          size="sm"
          variant={item.id === activeId ? "secondary" : "outline"}
          onClick={() => onSelect(item.id)}
        >
          {item.name}
        </Button>
      ))}
    </>
  );
}
