import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states, districtsByState, subdivisionsByDistrict, mockMandiPrices } from "@/data/mockData";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MandiPrice = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [results, setResults] = useState<typeof mockMandiPrices | null>(null);

  const handleCheck = () => setResults(mockMandiPrices);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" /> Mandi Bhav Forecast
        </h2>
        <p className="text-muted-foreground mt-1">Check predicted crop prices at your nearest mandi.</p>
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
          <Button onClick={handleCheck} size="lg" className="w-full text-lg font-bold">
            Check Prices
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Predicted Mandi Prices (₹/Quintal)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minPrice" fill="hsl(142, 43%, 32%)" name="Min Price" />
                <Bar dataKey="modalPrice" fill="hsl(43, 80%, 60%)" name="Modal Price" />
                <Bar dataKey="maxPrice" fill="hsl(30, 85%, 55%)" name="Max Price" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MandiPrice;
