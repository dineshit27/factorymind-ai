import {
  Home as HomeIcon,
  LayoutDashboard as LayoutDashboardIcon,
  CreditCard as CreditCardIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon,
  MessageSquare as MessageSquareIcon,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
  { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
  { icon: CreditCardIcon, label: "Billing", href: "/billing" },
  { icon: BarChartIcon, label: "Analytics", href: "/analytics" },
    { icon: MessageSquareIcon, label: "Community", href: "/community" },
    { icon: UserIcon, label: "Profile", href: "/profile" },
  ];

  // Listen for a global toggle event so the header can control the sidebar on mobile
  useEffect(() => {
    const handler: EventListener = () => setIsMobileMenuOpen(prev => !prev);
    window.addEventListener("toggle-mobile-menu", handler);
    return () => {
      window.removeEventListener("toggle-mobile-menu", handler);
    };
  }, []);

  return (
    <>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen flex flex-col border-r bg-background/95 backdrop-blur-lg transition-all duration-300 z-50",
          // Desktop behavior
          "hidden md:flex",
          collapsed ? "md:w-16" : "md:w-64",
          // Mobile behavior - slide in from left
          "md:relative fixed top-0 left-0",
          isMobileMenuOpen ? "flex w-64" : "hidden md:flex"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={cn("font-semibold text-lg", collapsed && "hidden")}>AQUAWATT</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCollapsed(!collapsed);
              // Close mobile menu when collapsing on mobile
              if (window.innerWidth < 768) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="h-8 w-8"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors min-h-[44px]",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {(!collapsed || isMobileMenuOpen) && <span className="text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
