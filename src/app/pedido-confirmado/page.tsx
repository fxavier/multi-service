
import { Suspense } from 'react';
import PedidoConfirmado from './PedidoConfirmado';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function PedidoConfirmadoLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardContent className="text-center py-12">
            <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto mb-6" />
            
            <div className="bg-muted p-4 rounded-lg mb-6">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-8 w-48 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<PedidoConfirmadoLoading />}>
      <PedidoConfirmado />
    </Suspense>
  );
}
