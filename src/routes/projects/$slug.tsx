import { createFileRoute } from "@tanstack/react-router";
import { getProjectBySlug } from "@/data/projectsData";
import { ProjectDetailView } from "@/components/royal/ProjectDetailView";
import { useProject } from "@/hooks/use-projects";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    const title = project ? `${project.name} — ROYAL300` : "Project — ROYAL300";
    const description = project ? project.copy : "ROYAL300 Case Study";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProjectRouteComponent,
});

function ProjectRouteComponent() {
  const { slug } = Route.useParams();
  const { project, isLoading } = useProject(slug);

  if (!project) {
    if (isLoading) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
          <p className="text-sm text-muted-foreground">Loading project details...</p>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-display text-3xl font-bold">Project Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The requested project portfolio page could not be located.
        </p>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}

