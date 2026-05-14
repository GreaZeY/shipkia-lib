import { Search, Bell, User } from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import Button from "@/components/ui/inputs/Button/Button";
import Input from "@/components/ui/inputs/Input/Input";

const Header = () => {
  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-transparent p-2 transition-colors">
      <div className="flex flex-1 justify-end px-12">
        <div className="w-full max-w-xl">
          <Input
            placeholder="Search for components, guides..."
            type="search"
            startIcon={<Search size={18} />}
            className="!rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="mr-4 flex items-center space-x-3">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-2xl bg-muted/50 text-muted-foreground hover:text-foreground"
          >
            <Bell size={18} />
          </Button>
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border bg-muted shadow-sm transition-transform hover:scale-105">
            <User size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
