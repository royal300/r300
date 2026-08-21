import { createFileRoute } from "@tanstack/react-router";
import { getProjectBySlug } from "@/data/projectsData";
import { ProjectDetailView } from "@/components/royal/ProjectDetailView";

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
  const project = getProjectBySlug(slug);

  if (!project) {
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
