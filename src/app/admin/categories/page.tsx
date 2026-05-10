import CategoryForm from "@/components/admin/CategoryForm";
import CategoryDeleteButton from "@/components/admin/CategoryDeleteButton";
import { categoryService } from "@/services/category.service";

export default async function AdminCategoriesPage() {
  const categories = await categoryService.listAdmin();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[58px] text-6xl font-bold">Taxonomy & Promotions</h1>
        <p className="mt-2 text-2xl text-zinc-600">Manage store categories and discount coupons.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-300 bg-zinc-100 p-5">
          <h2 className="text-4xl text-4xl font-semibold">Categories</h2>
          <CategoryForm />
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-4">
                <div>
                  <p className="text-2xl font-semibold">{category.name}</p>
                  <p className="text-zinc-600">/{category.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm ${category.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{category.isActive ? "Active" : "Inactive"}</span>
                  <CategoryDeleteButton id={category.id} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-5">
          <h2 className="text-4xl text-4xl font-semibold">Coupons</h2>
          <p className="mt-2 text-zinc-600">Use dedicated Coupons page to create and manage offers.</p>
          <a href="/admin/coupons" className="mt-4 inline-block rounded-xl bg-black px-4 py-2 font-semibold text-white">Open Coupons</a>
        </div>
      </div>
    </div>
  );
}

