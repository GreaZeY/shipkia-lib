import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "motion/react";
import { PREMIUM_EASE } from "@/lib/motion";

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="relative flex h-screen w-full gap-2 overflow-hidden pl-4 font-sans transition-colors duration-500">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
