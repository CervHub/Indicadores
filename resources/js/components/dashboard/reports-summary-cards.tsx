import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsSummaryCardsProps {
    data?: any[];
}

export default function ReportsSummaryCards({ data = [] }: ReportsSummaryCardsProps) {
    console.log('ReportsSummaryCards data:', data);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Debug Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Data Length
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Total items received
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
