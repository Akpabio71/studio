import { AppShell } from '@/components/AppShell';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { recentMistakes } from '@/lib/data';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              An overview of your communication progress.
            </p>
          </div>

          <AnalyticsSummary />

          <PerformanceChart />

          <Card>
            <CardHeader>
              <CardTitle>Recent Mistakes</CardTitle>
              <CardDescription>
                Review recent corrections to learn and improve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Original</TableHead>
                    <TableHead className="w-1/3">Corrected</TableHead>
                    <TableHead className="w-1/3 text-right">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMistakes.map(mistake => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium text-muted-foreground line-through">
                        {mistake.original}
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        {mistake.corrected}
                      </TableCell>
                      <TableCell className="text-right">{mistake.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
