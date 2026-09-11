import * as React from "react";

const DEFAULT_LOGO = "/royal300_logo.jpg";

/**
 * Site-wide settings (currently just the logo) shared by the public Navbar,
 * Footer, and the admin panel's own header — all three render whatever the
 * admin last uploaded via the Site Logo panel.
 */
export function useSiteSettings() {
  const [logoUrl, setLogoUrl] = React.useState<string>(DEFAULT_LOGO);

  const refetch = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.logoUrl) setLogoUrl(data.logoUrl);
    } catch {
      // keep the default logo on failure
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { logoUrl, refetch };
}
