import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, productVariants } from "@/db/schema";
import { ensureSeeded } from "@/lib/data";
import { zar, centsToRandInput } from "@/lib/format";

export default async function AdminProductsPage() {
  await ensureSeeded();
  const [rows, cats] = await Promise.all([
    db.select().from(products).orderBy(desc(products.id)),
    db.select().from(categories).orderBy(categories.sortOrder),
  ]);
  const catMap = new Map(cats.map((c) => [c.id, c]));

  const [variantRows] = await Promise.all([
    db.select({ productId: productVariants.productId, id: productVariants.id }).from(productVariants),
  ]);
  const variantCount = new Map<number, number>();
  for (const v of variantRows) variantCount.set(v.productId, (variantCount.get(v.productId) ?? 0) + 1);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-plum-deep">Products</h1>
          <p className="mt-1 text-sm text-ink/70">
            {rows.length} products · Edit stock, pricing and status below. Image URLs can be replaced anytime.
          </p>
        </div>
        <LinkAdmin href="/admin">← Dashboard</LinkAdmin>
      </div>

      {/* Add product */}
      <details className="card-luxe group mt-8 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-xl text-plum-deep [&::-webkit-details-marker]:hidden">
          + Add a new product
          <span className="text-sm font-sans text-mauve">(expand)</span>
        </summary>
        <form action="/api/admin/products" method="post" className="grid gap-4 border-t border-blush-100 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Product name *" name="name" required />
          <label className="block">
            <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mauve">Category *</span>
            <select name="categoryId" required className="input-luxe cursor-pointer">
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <Input label="Price (R) *" name="price" required type="number" step="0.01" min="0" placeholder="149.00" />
          <Input label="Sale price (R, optional)" name="sale" type="number" step="0.01" min="0" placeholder="119.00" />
          <Input label="Stock *" name="stock" required type="number" min="0" defaultValue="10" />
          <Input label="SKU" name="sku" placeholder="ZR-XXXX" />
          <Input label="Tagline (short)" name="tagline" />
          <label className="block sm:col-span-2 lg:col-span-3">
            <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mauve">Description</span>
            <textarea name="description" rows={2} className="input-luxe resize-y" />
          </label>
          <label className="block sm:col-span-2 lg:col-span-3">
            <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mauve">Images — comma separated URLs</span>
            <input name="images" className="input-luxe" placeholder="https://…, https://…" />
          </label>
          <label className="block sm:col-span-2 lg:col-span-3">
            <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mauve">What&apos;s included — one per line</span>
            <textarea name="included" rows={2} className="input-luxe resize-y" />
          </label>
          <div className="flex flex-wrap items-end gap-5 sm:col-span-2 lg:col-span-3">
            {[
              ["featured", "Featured"],
              ["bestSeller", "Best seller"],
              ["isNew", "New arrival"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-plum">
                <input type="checkbox" name={key} value="1" className="accent-[#93702f]" /> {label}
              </label>
            ))}
            <button type="submit" className="btn btn-gold ml-auto">Create product</button>
          </div>
        </form>
      </details>

      {/* Product list */}
      <div className="card-luxe mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-blush-100 text-[0.66rem] uppercase tracking-[0.18em] text-mauve">
                <th className="px-4 py-3.5 font-semibold">Product</th>
                <th className="px-4 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold">Price</th>
                <th className="px-4 py-3.5 font-semibold">Stock</th>
                <th className="px-4 py-3.5 font-semibold">Flags</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-blush-100/70 align-top">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="h-12 w-10 rounded-lg border border-blush-100 object-cover" />
                      ) : (
                        <span className="grid h-12 w-10 place-items-center rounded-lg bg-blush-100 text-xs text-mauve">—</span>
                      )}
                      <div>
                        <p className="font-medium text-plum-deep">{p.name}</p>
                        <p className="text-xs text-mauve">{p.sku ?? "no sku"} · {p.slug}</p>
                        {variantCount.get(p.id) ? <p className="text-xs text-gold-deep">{variantCount.get(p.id)} shade/option variants</p> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{catMap.get(p.categoryId)?.name ?? p.categoryId}</td>
                  <td className="px-4 py-4">
                    <p className="tabular-nums">{zar(p.priceCents)}</p>
                    {p.salePriceCents ? <p className="text-xs text-rose-deep tabular-nums">sale {zar(p.salePriceCents)}</p> : null}
                  </td>
                  <td className={`px-4 py-4 font-medium ${p.stock <= 15 ? "text-rose-deep" : ""}`}>{p.stock}</td>
                  <td className="px-4 py-4 text-xs">
                    {p.featured && <span className="mr-1 rounded-full bg-gold-light px-2 py-0.5 text-gold-deep">Featured</span>}
                    {p.bestSeller && <span className="mr-1 rounded-full bg-blush-100 px-2 py-0.5 text-plum">Bestseller</span>}
                    {p.isNew && <span className="mr-1 rounded-full bg-lavender/60 px-2 py-0.5 text-lavender-deep">New</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase ${p.status === "active" ? "bg-blush-100 text-plum" : "bg-rose/10 text-rose-deep"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="relative px-4 py-4">
                    <details>
                      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep [&::-webkit-details-marker]:hidden">
                        Edit
                      </summary>
                      <div className="absolute right-4 z-10 mt-2 w-80 rounded-2xl border border-blush-100 bg-ivory p-5 shadow-lift">
                        <form action={`/api/admin/products/${p.id}`} method="post" className="space-y-3">
                          <input type="hidden" name="action" value="update" />
                          <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                              <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-mauve">Price (R)</span>
                              <input name="price" type="number" step="0.01" min="0" defaultValue={centsToRandInput(p.priceCents)} className="input-luxe !px-3 !py-2 text-sm" />
                            </label>
                            <label className="block">
                              <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-mauve">Sale (R, blank=none)</span>
                              <input name="sale" type="number" step="0.01" min="0" defaultValue={p.salePriceCents ? centsToRandInput(p.salePriceCents) : ""} className="input-luxe !px-3 !py-2 text-sm" />
                            </label>
                            <label className="block">
                              <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-mauve">Stock</span>
                              <input name="stock" type="number" min="0" defaultValue={p.stock} className="input-luxe !px-3 !py-2 text-sm" />
                            </label>
                            <label className="block">
                              <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-mauve">Status</span>
                              <select name="status" defaultValue={p.status} className="input-luxe cursor-pointer !px-3 !py-2 text-sm">
                                <option value="active">active</option>
                                <option value="draft">draft</option>
                              </select>
                            </label>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-plum">
                            <label className="flex items-center gap-1.5"><input type="checkbox" name="featured" value="1" defaultChecked={p.featured} className="accent-[#93702f]" /> Featured</label>
                            <label className="flex items-center gap-1.5"><input type="checkbox" name="bestSeller" value="1" defaultChecked={p.bestSeller} className="accent-[#93702f]" /> Bestseller</label>
                            <label className="flex items-center gap-1.5"><input type="checkbox" name="isNew" value="1" defaultChecked={p.isNew} className="accent-[#93702f]" /> New</label>
                          </div>
                          <button type="submit" className="btn btn-gold w-full !py-2.5 !text-[0.65rem]">Save changes</button>
                        </form>
                        <form action={`/api/admin/products/${p.id}`} method="post" className="mt-2">
                          <input type="hidden" name="action" value="delete" />
                          <button type="submit" className="w-full cursor-pointer rounded-full border border-rose/40 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep transition hover:bg-rose/10">
                            Delete product
                          </button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, required, type = "text", step, min, defaultValue, placeholder }: { label: string; name: string; required?: boolean; type?: string; step?: string; min?: string; defaultValue?: string | number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mauve">{label}</span>
      <input name={name} required={required} type={type} step={step} min={min} defaultValue={defaultValue} placeholder={placeholder} className="input-luxe" />
    </label>
  );
}

function LinkAdmin({ href, children }: { href: string; children: React.ReactNode }) {
  // local helper to avoid pulling Link import twice
  return <a href={href} className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mauve hover:bg-blush-100">{children}</a>;
}
