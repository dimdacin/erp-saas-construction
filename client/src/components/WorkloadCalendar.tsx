import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface Assignment {
  id: string;
  resource: string;
  project: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
}

interface WorkloadCalendarProps {
  assignments: Assignment[];
}

export default function WorkloadCalendar({ assignments }: WorkloadCalendarProps) {
  const getWorkloadLevel = (hours: number) => {
    if (hours >= 8) return { label: "Pleine charge", variant: "destructive" as const };
    if (hours >= 6) return { label: "Charge élevée", variant: "default" as const };
    return { label: "Charge normale", variant: "outline" as const };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Plan de Charge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const workload = getWorkloadLevel(assignment.hoursPerDay);
            return (
              <div
                key={assignment.id}
                className="flex items-center gap-4 p-4 rounded-md border hover-elevate"
                data-testid={`card-assignment-${assignment.id}`}
              >
                <div className="flex-1">
                  <div className="font-medium">{assignment.resource}</div>
                  <div className="text-sm text-muted-foreground">{assignment.project}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{assignment.startDate} - {assignment.endDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{assignment.hoursPerDay}h/j</div>
                  <Badge variant={workload.variant} className="mt-1">
                    {workload.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
