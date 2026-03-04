import { useLoaderData } from "react-router";

export function HomePage() {
  const { name } = useLoaderData() as { name: string };
  return <div>Hello from the Home page, {name}!</div>;
}
