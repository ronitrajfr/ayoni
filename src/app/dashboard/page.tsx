import { Suspense } from "react";
import CreateWebsite from "./_components/create-website";
import WebsiteList, { WebsiteListSkeleton } from "./_components/website-list";

const DashboardPage = () => {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Websites</h1>
        <CreateWebsite />
      </div>
      <div className="relative overflow-x-auto">
        <Suspense fallback={<WebsiteListSkeleton />}>
          <WebsiteList />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardPage;
