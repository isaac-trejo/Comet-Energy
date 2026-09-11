import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Admin dashboard</h1>
      <p>Signed in as {session.user.email}.</p>
    </main>
  );
}
