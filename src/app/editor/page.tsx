import { protectServer } from "@/features/auth/utils";

export default async function EditorPage() {
  await protectServer();
  return (
    <div>
      <h1>Hello Page</h1>
    </div>
  );
}