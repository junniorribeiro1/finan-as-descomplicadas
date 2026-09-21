import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/natalia")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
