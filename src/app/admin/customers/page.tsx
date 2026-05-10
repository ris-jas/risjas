import { userRepository } from "@/repositories/user.repository";

export default async function AdminCustomersPage() {
  const customers = await userRepository.listCustomers();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="space-y-2 text-sm">{customers.map((customer) => <div key={customer.id} className="flex justify-between rounded bg-slate-50 p-2"><span>{customer.name}</span><span>{customer.email}</span></div>)}</div></div>
    </div>
  );
}