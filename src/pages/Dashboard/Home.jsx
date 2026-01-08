import DashboardMetrics from "../../components/dashboardData/DashboardMetrics";

export default function Home() {
  return (
    <>
      {/* Top Section */}

      {/* <ComponentCard > */}
      <div className="grid gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7 space-y-6">
          <DashboardMetrics />
        </div>
      </div>
      {/* </ComponentCard> */}
    </>
  );
}
