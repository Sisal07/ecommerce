import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png'; // adjust path if needed

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-[#C0C0C0]/10 bg-[#0B0B0B] text-[#F5F5F5] font-['Inter','Poppins',sans-serif]">
      <SidebarHeader className="border-b border-[#2A2A2A]/60 bg-[#0B0B0B] p-5">
        <Link to="/admin" className="flex items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="SISAL Admin"
              className="h-10 w-10 object-contain rounded-lg"
            />
            {!isCollapsed && (
              <div className="leading-tight">
                <span className="block text-lg font-light tracking-wide text-[#F5F5F5]">
                  Admin
                </span>
              </div>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#0B0B0B] px-3 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C0C0C0]/45">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-3">
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`h-11 rounded-2xl px-3 transition-all duration-300 ${
                        active
                          ? 'border border-[#C0C0C0]/22 bg-[#C0C0C0]/12 text-[#F5F5F5] shadow-[0_12px_30px_rgba(0,0,0,0.25)]'
                          : 'text-[#C0C0C0]/65 hover:bg-[#171717] hover:text-[#F5F5F5]'
                      }`}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-11 rounded-2xl px-3 text-[#C0C0C0]/65 transition-all duration-300 hover:bg-[#171717] hover:text-[#F5F5F5]"
                >
                  <Link to="/" className="flex items-center gap-3">
                    <ArrowLeft className="h-5 w-5" />
                    {!isCollapsed && <span>Back to Store</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="h-11 rounded-2xl px-3 text-[#C0C0C0]/65 transition-all duration-300 hover:bg-[#171717] hover:text-[#F5F5F5]"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0B0B0B] font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-16 items-center border-b border-[#C0C0C0]/10 bg-[#0B0B0B]/90 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6">
            <SidebarTrigger className="mr-4 rounded-xl border border-[#C0C0C0]/14 bg-[#171717] text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0]/35 hover:bg-[#2A2A2A] hover:text-[#F5F5F5]" />

            <div className="flex min-w-0 flex-col">
              <h1 className="truncate text-lg font-semibold tracking-tight text-[#F5F5F5]">
                Admin Dashboard
              </h1>
              <p className="hidden text-xs text-[#C0C0C0]/50 sm:block">
                Premium SISAL management workspace
              </p>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(192,192,192,0.08),transparent_30%),#0B0B0B] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;