import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-4 border-b">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">
          Your Portfolios
        </h1>
        <p className="text-muted-foreground">
          Manage and create professional developer portfolios
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <Input
            type="search"
            placeholder="Search portfolios..."
            className="w-full md:w-[200px] pl-9"
          />
        </div>
        <Link to="/dashboard/new">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            New Portfolio
          </Button>
        </Link>
      </div>
    </div>
  );
}
