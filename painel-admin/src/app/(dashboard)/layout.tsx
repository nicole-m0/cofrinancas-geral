import { Sidebar } from "@/components/Sidebar";
import { requireAdminSession } from "@/lib/data";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await requireAdminSession();

  return (
    <div className="flex min-h-dvh">
      <Sidebar userName={user.name ?? "Admin"} userEmail={user.email ?? ""} />
      <main className="min-w-0 flex-1 bg-screen px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
