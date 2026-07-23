import { auth } from "./auth";

export default async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }

    return { id: session.user.id, email: session.user.email };
  } catch {
    return null;
  }
}
