"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { goals } from "@/data/goals";
import {
  ageBands,
  conditionOptions,
  dietOptions,
  medicationOptions,
  sexOptions,
  type AgeBand,
  type Diet,
  type Sex,
} from "@/data/consultant-options";
import type { GoalId } from "@/data/types";

type IngredientOption = { slug: string; name: string; category: string };

export function ConsultantStudio({
  initialGoal,
  ingredients,
}: {
  initialGoal?: string;
  ingredients: IngredientOption[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<GoalId[]>(
    initialGoal && goals.some((goal) => goal.id === initialGoal) ? [initialGoal as GoalId] : [],
  );
  const [ageBand, setAgeBand] = useState<AgeBand>("31-50");
  const [sex, setSex] = useState<Sex>("unspecified");
  const [diet, setDiet] = useState<Diet>("omnivore");
  const [pregnant, setPregnant] = useState(false);
  const [lactating, setLactating] = useState(false);
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [current, setCurrent] = useState<string[]>([]);
  const [avoidHerbs, setAvoidHerbs] = useState(false);
  const [preferTested, setPreferTested] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [filter, setFilter] = useState("");

  const visibleIngredients = useMemo(() => {
    const query = filter.trim().toLowerCase();
    return ingredients
      .filter((item) => !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
      .slice(0, 8);
  }, [filter, ingredients]);

  function toggleGoal(id: GoalId) {
    setSelected((currentGoals) => {
      if (currentGoals.includes(id)) return currentGoals.filter((goal) => goal !== id);
      if (currentGoals.length >= 3) return [...currentGoals.slice(1), id];
      return [...currentGoals, id];
    });
  }

  function toggle(list: string[], id: string, setter: (value: string[]) => void) {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  async function submit() {
    setPending(true);
    setError("");
    const response = await fetch("/api/consultant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goals: selected,
        ageBand,
        sex,
        diet,
        pregnant: sex === "male" ? false : pregnant,
        lactating: sex === "male" ? false : lactating,
        conditions,
        medications,
        current,
        avoidHerbs,
        preferTested,
        notes,
      }),
    });
    const payload = (await response.json()) as { id?: number; error?: string };
    setPending(false);
    if (!response.ok || !payload.id) {
      setError(payload.error || "The guide could not write a note. Try again.");
      return;
    }
    router.push(`/consultant/${payload.id}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <section>
          <p className="eyebrow text-copper">01 · Goals</p>
          <h2 className="mt-2 text-3xl">What are you actually trying to change?</h2>
          <p className="mt-2 text-sm text-muted">Choose up to three. A narrower question gets a sharper note.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {goals.map((goal) => {
              const on = selected.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`rounded-2xl border p-4 text-left ${on ? "border-moss bg-sage" : "border-line bg-white/60"}`}
                >
                  <p className="text-xs uppercase tracking-widest text-muted">{goal.kicker}</p>
                  <p className="mt-1 font-display text-2xl">{goal.name}</p>
                  <p className="mt-1 text-sm leading-5 text-[#3d4f46]">{goal.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel p-5">
          <p className="eyebrow text-copper">02 · Context</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Select label="Age" value={ageBand} onChange={(value) => setAgeBand(value as AgeBand)} options={ageBands} />
            <Select label="Sex" value={sex} onChange={(value) => setSex(value as Sex)} options={sexOptions} />
            <Select label="Diet" value={diet} onChange={(value) => setDiet(value as Diet)} options={dietOptions} />
          </div>
          {sex !== "male" ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={pregnant} onChange={(event) => setPregnant(event.target.checked)} />
                Pregnant or trying to conceive
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={lactating} onChange={(event) => setLactating(event.target.checked)} />
                Lactating
              </label>
            </div>
          ) : null}
        </section>

        <section className="panel p-5">
          <p className="eyebrow text-copper">03 · Health constraints</p>
          <p className="mt-2 text-sm text-muted">These change the avoid list. They are not a medical history.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {conditionOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(conditions, item.id, setConditions)}
                className={`chip ${conditions.includes(item.id) ? "border-moss bg-sage" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {medicationOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(medications, item.id, setMedications)}
                className={`chip ${medications.includes(item.id) ? "border-copper bg-blush" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <p className="eyebrow text-copper">04 · Already taking</p>
          <input
            className="field mt-3"
            placeholder="Filter the library"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleIngredients.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => toggle(current, item.slug, setCurrent)}
                className={`chip ${current.includes(item.slug) ? "border-moss bg-sage" : ""}`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <textarea
            className="field mt-4 min-h-28"
            maxLength={500}
            placeholder="Optional: migraines, heavy periods, a statin that makes your legs ache, jet lag next week."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={avoidHerbs} onChange={(event) => setAvoidHerbs(event.target.checked)} />
              Leave botanicals out
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={preferTested} onChange={(event) => setPreferTested(event.target.checked)} />
              Prefer third-party tested labels
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="ink-panel rounded-[1.6rem] p-6">
          <p className="eyebrow text-[#e7c7a4]">Guide note</p>
          <h2 className="mt-3 text-4xl leading-tight">
            {selected.length ? goals.filter((goal) => selected.includes(goal.id)).map((goal) => goal.name).join(" · ") : "Choose a goal to begin."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#d7e2da]">
            The model ranks monographs by outcome evidence, then removes anything that collides with pregnancy, medicines, or the conditions you marked. It will not invent a dose.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[#f6f1e8]">
            <li>{conditions.length ? `${conditions.length} health flags` : "No conditions marked"}</li>
            <li>{medications.length ? `${medications.length} medicine classes` : "No medicines marked"}</li>
            <li>{current.length ? `${current.length} already on the shelf` : "No current supplements selected"}</li>
          </ul>
          {error ? <p className="mt-4 text-sm text-[#f0c2ae]">{error}</p> : null}
          <button type="button" onClick={submit} disabled={pending || selected.length === 0} className="btn btn-copper mt-6 w-full disabled:opacity-50">
            {pending ? "Reading the library…" : "Write the note"}
          </button>
          <p className="mt-3 text-xs leading-5 text-[#b7c4bb]">
            Educational only. If you are under 18, the guide will stop rather than recommend a product.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { id: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
