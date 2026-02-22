import { Button } from "@/components/ui/button";
import Link from "next/link";

const SettingsPage = () => {
  return (
    <div className="pt-5 mt-2 flex flex-col gap-4 mx-auto">
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      <p>Manage your account settings here.</p>
      <Button asChild>
        <Link href="/api/auth/signout">Sign Out</Link>
      </Button>
    </div>
  );
};

export default SettingsPage;
