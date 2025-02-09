import AppSidebar from "@/components/dashboard/AppSidebar";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, Outlet, useLocation } from "react-router-dom";
import { useRouteStore } from "@/stores/useRouteStore";
import { use, useEffect } from "react";
import { useNoteStore } from "@/stores/useNoteStore";

const Dashboard = () => {
  const { setRoutes, routes } = useRouteStore();
  const { getNoteName } = useNoteStore();
  const location = useLocation();

  useEffect(() => {
    let path = '/';

    const segments = location.pathname.split('/').filter(Boolean);
    const routes = [
      { name: 'NoteHub', path: '/' },
    ];
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      path += `${segment}/`;
      if (segment === 'note') {
        const noteId = segments[++i];
        path += `${noteId}/`;
        const noteName = getNoteName(noteId);
        routes.push({ name: noteName, path });
      } else {
        const name = segment;
        routes.push({ name, path });
      }
    }
    setRoutes(routes);
  }, [location]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="scrollbar-custom relative h-svh overflow-hidden">
        <header className="flex border border-b sticky top-0 z-10 bg-background justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {
                  routes.map((route, index) => (
                    <>
                      <BreadcrumbItem key={index}>
                        <Link to={route.path} className="text-primary">
                          {route.name}
                        </Link>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  ))
                }
                
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>

        {/* ================ Route ================  */}
        <Outlet />

      </SidebarInset>
    </SidebarProvider>
  )
}


export default Dashboard;