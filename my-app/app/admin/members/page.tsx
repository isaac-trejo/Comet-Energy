import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function MembersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Members</h1>
      <p className="text-gray-600 mb-6">Signed in as {session.user.email}.</p>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <p className="text-gray-600">Members management coming soon...</p>
      </div>
    </div>
  );
}
