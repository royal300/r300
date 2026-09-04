import * as React from "react";
import { projectsData, ProjectData } from "@/data/projectsData";

export function useProjects() {
  const [projects, setProjects] = React.useState<ProjectData[]>(projectsData);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error(`Failed to fetch clients: ${res.statusText}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.clients) && data.clients.length > 0) {
        setProjects(data.clients);
      }
      setError(null);
    } catch (err: any) {
      console.warn("Could not fetch clients from API, using fallback data:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}

export function useProject(slug: string) {
  const [project, setProject] = React.useState<ProjectData | undefined>(() => {
    return projectsData.find((p) => p.slug === slug);
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchProject() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/clients/${slug}`);
        if (!res.ok) {
          // Fallback to local data
          if (isMounted) {
            setProject(projectsData.find((p) => p.slug === slug));
          }
          return;
        }
        const data = await res.json();
        if (data.success && data.client && isMounted) {
          setProject(data.client);
        }
      } catch (err) {
        if (isMounted) {
          setProject(projectsData.find((p) => p.slug === slug));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { project, isLoading };
}
