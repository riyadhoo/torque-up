
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Car, Wrench, MessageSquare, CheckCircle, Clock, DollarSign } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalParts: number;
  totalCars: number;
  totalMessages: number;
  pendingParts: number;
  approvedParts: number;
  totalRevenue?: number;
  averagePartPrice?: number;
}

export function AdminStatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalParts: 0,
    totalCars: 0,
    totalMessages: 0,
    pendingParts: 0,
    approvedParts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [
          { count: totalUsers },
          { count: totalParts },
          { count: totalCars },
          { count: totalMessages },
          { count: pendingParts },
          { count: approvedParts },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('parts').select('*', { count: 'exact', head: true }),
          supabase.from('cars').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }),
          supabase.from('parts').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
          supabase.from('parts').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved'),
        ]);

        // Fetch average part price and total revenue
        const { data: partsData } = await supabase
          .from('parts')
          .select('price')
          .eq('approval_status', 'approved');

        let averagePartPrice = 0;
        let totalRevenue = 0;

        if (partsData && partsData.length > 0) {
          const prices = partsData.map(part => Number(part.price) || 0);
          totalRevenue = prices.reduce((sum, price) => sum + price, 0);
          averagePartPrice = totalRevenue / prices.length;
        }

        setStats({
          totalUsers: totalUsers || 0,
          totalParts: totalParts || 0,
          totalCars: totalCars || 0,
          totalMessages: totalMessages || 0,
          pendingParts: pendingParts || 0,
          approvedParts: approvedParts || 0,
          totalRevenue,
          averagePartPrice,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} Da`;
  };

  if (loading) {
    return <div className="text-center">Loading statistics...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Registered users in the platform
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalParts}</div>
          <p className="text-xs text-muted-foreground">
            Parts listed on the platform
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCars}</div>
          <p className="text-xs text-muted-foreground">
            Cars in the database
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            Messages exchanged between users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Parts</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingParts}</div>
          <p className="text-xs text-muted-foreground">
            Parts awaiting approval
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Parts</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.approvedParts}</div>
          <p className="text-xs text-muted-foreground">
            Parts approved and visible
          </p>
        </CardContent>
      </Card>

      {stats.totalRevenue !== undefined && stats.totalRevenue > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Combined value of all approved parts
            </p>
          </CardContent>
        </Card>
      )}

      {stats.averagePartPrice !== undefined && stats.averagePartPrice > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Part Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.averagePartPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Average price of approved parts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
