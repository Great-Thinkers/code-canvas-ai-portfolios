import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PortfolioCardProps = {
  id: string;
  name: string;
  template: string;
  lastUpdated: string;
  isPublished: boolean;
  previewUrl: string;
};

export default function PortfolioCard({
  id,
  name,
  template,
  lastUpdated,
  isPublished,
  previewUrl,
}: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/50 flex flex-col">
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={previewUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Template: {template}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to={`/dashboard/edit/${id}`} className="w-full flex">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      </CardContent>
      <CardFooter className="px-5 py-4 border-t border-border/40 flex justify-between">
        <Link to={`/dashboard/edit/${id}`}>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </Link>
        <Link to={`/dashboard/preview/${id}`}>
          <Button size="sm">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
