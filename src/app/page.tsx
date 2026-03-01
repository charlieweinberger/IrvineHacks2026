import { OperationsStudio } from "@/components/operations-studio";
import { getEventData } from "@/lib/eventStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getEventData();
  return <OperationsStudio initialData={data} />;
}
