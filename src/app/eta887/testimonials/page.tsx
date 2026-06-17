import { getAllTestimonials } from "@/lib/admin/queries";
import { TestimonialRow } from "@/components/admin/TestimonialRow";
import { AddTestimonial } from "@/components/admin/AddTestimonial";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  const list = await getAllTestimonials();

  return (
    <div>
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Testimonials</h1>
        <p className="mt-1 text-sm text-ink-400">
          The “what people say” section. {list.length} total.
        </p>
      </header>

      <div className="mt-6 space-y-3">
        <AddTestimonial />
        {list.map((t) => (
          <TestimonialRow key={t.id} item={t} />
        ))}
      </div>
    </div>
  );
}
