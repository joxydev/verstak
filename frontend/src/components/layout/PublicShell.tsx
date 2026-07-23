import { Outlet } from "react-router-dom";

import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SkipLink } from "./SkipLink";

export function PublicShell() {
  return (
    <div className="public-shell">
      <SkipLink />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
