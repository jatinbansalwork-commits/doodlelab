"use client";

import { ConceptCard } from "@/components/concepts/ConceptCard";
import { useDoodleStore } from "@/store/doodle-store";

export function ConceptPicker() {
  const concepts = useDoodleStore((s) => s.concepts);
  const pickedConceptId = useDoodleStore((s) => s.pickedConceptId);
  const pickConcept = useDoodleStore((s) => s.pickConcept);
  const openBoard = useDoodleStore((s) => s.openBoard);
  const backToPrompt = useDoodleStore((s) => s.backToPrompt);
  const prompt = useDoodleStore((s) => s.prompt);

  return (
    <div className="min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <button
          type="button"
          onClick={backToPrompt}
          aria-label="Back"
          className="font-[family-name:var(--font-hand)] text-[22px] leading-none text-[#111] hover:opacity-70"
        >
          ←
        </button>

        <header className="mt-5 max-w-3xl">
          <h1 className="font-[family-name:var(--font-hand)] text-[48px] leading-[1.08] text-[#111] sm:text-[56px]">
            Pick your favorite
          </h1>
          <p className="mt-4 font-[family-name:var(--font-hand)] text-[22px] leading-snug text-[#111] sm:text-[24px]">
            Three creative directions for &ldquo;{prompt}&rdquo;
          </p>
        </header>

        <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-10">
          {concepts.map((concept, i) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              index={i}
              isPicked={pickedConceptId === concept.id}
              onPick={() => pickConcept(concept.id)}
              onOpen={openBoard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
