
import { DashboardHeader } from "@/components/DashboardHeader";
import { DevicesPanel } from "@/components/DevicesPanel";

const Devices = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col w-full md:w-auto">
        <DashboardHeader />
        <div className="flex-1 p-6">
          <DevicesPanel />
        </div>
      </main>
    </div>
  );
};

export default Devices;
