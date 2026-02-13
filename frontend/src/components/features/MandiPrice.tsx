import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states, districtsByState, subdivisionsByDistrict } from "@/data/mockData";
import { TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MandiApiRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  min_price?: string;
  max_price?: string;
  modal_price?: string;
  price_date?: string;
}

interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
}

const MandiPrice = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [results, setResults] = useState<MandiRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (district) params.append('district', district);

      const response = await fetch(`http://127.0.0.1:8000/api/mandi/proxy/?${params.toString()}`);

      const data = await response.json();

      if (data.success) {
        // Transform API data to chart format
        const transformedResults = data.records.map((record: MandiApiRecord) => ({
          state: record.state || state,
          district: record.district || district,
          market: record.market || 'Unknown',
          commodity: record.commodity || 'Unknown',
          variety: record.variety || '-',
          min_price: parseFloat(String(record.min_price)) || 0,
          max_price: parseFloat(String(record.max_price)) || 0,
          modal_price: parseFloat(String(record.modal_price)) || 0,
          price_date: record.price_date || new Date().toISOString().split('T')[0],
        }));
        setResults(transformedResults);
      } else {
        setError(data.message || 'Failed to fetch mandi prices');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Error fetching mandi prices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform data for chart
  const chartData = results?.map((record) => ({
    name: record.commodity.length > 10 ? record.commodity.substring(0, 10) + '...' : record.commodity,
    market: record.market,
    minPrice: record.min_price,
    modalPrice: record.modal_price,
    maxPrice: record.max_price,
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" /> Mandi Bhav Forecast
        </h2>
        <p className="text-muted-foreground mt-1">Check real-time crop prices at your nearest mandi from data.gov.in</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">State</label>
              <Select value={state} onValueChange={(v) => { setState(v); setDistrict(""); setSubdivision(""); }}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">District</label>
              <Select value={district} onValueChange={(v) => { setDistrict(v); setSubdivision(""); }} disabled={!state}>
                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                <SelectContent>{(districtsByState[state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Subdivision</label>
              <Select value={subdivision} onValueChange={setSubdivision} disabled={!district}>
                <SelectTrigger><SelectValue placeholder="Select Subdivision" /></SelectTrigger>
                <SelectContent>{(subdivisionsByDistrict[district] || []).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCheck} size="lg" className="w-full text-lg font-bold" disabled={isLoading || !state}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Fetching Prices...
              </>
            ) : (
              'Check Prices'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.length > 0 && (
        <>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Mandi Prices (₹/Quintal)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {results.length} records for {district || state}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Market</th>
                      <th className="text-left py-2">Commodity</th>
                      <th className="text-right py-2">Min</th>
                      <th className="text-right py-2">Modal</th>
                      <th className="text-right py-2">Max</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 10).map((record, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">{record.market}</td>
                        <td className="py-2">{record.commodity}</td>
                        <td className="py-2 text-right">₹{record.min_price}</td>
                        <td className="py-2 text-right font-medium">₹{record.modal_price}</td>
                        <td className="py-2 text-right">₹{record.max_price}</td>
                        <td className="py-2 text-muted-foreground">{record.price_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    +{results.length - 10} more records
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Price Comparison Chart (₹/Quintal)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `₹${value}`}
                    labelFormatter={(label, payload) => {
                      const record = payload[0]?.payload;
                      return record?.market || label;
                    }}
                  />
                  <Bar dataKey="minPrice" fill="hsl(142, 43%, 32%)" name="Min Price" />
                  <Bar dataKey="modalPrice" fill="hsl(43, 80%, 60%)" name="Modal Price" />
                  <Bar dataKey="maxPrice" fill="hsl(30, 85%, 55%)" name="Max Price" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {results && results.length === 0 && !error && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">No price data found for the selected filters</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MandiPrice;
