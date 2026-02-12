import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states, districtsByState, mockMarkets } from "@/data/mockData";
import { Store, MapPin, Phone } from "lucide-react";

const MarketSelling = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState<typeof mockMarkets | null>(null);

  const handleSearch = () => setResults(mockMarkets);

  const handleLocation = () => {
    setState("Maharashtra");
    setDistrict("Pune");
    setResults(mockMarkets);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Store className="w-8 h-8 text-primary" /> Sell Your Produce
        </h2>
        <p className="text-muted-foreground mt-1">Find nearby mandis and markets to sell your crops.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">State</label>
              <Select value={state} onValueChange={(v) => { setState(v); setDistrict(""); }}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">District</label>
              <Select value={district} onValueChange={setDistrict} disabled={!state}>
                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                <SelectContent>{(districtsByState[state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSearch} size="lg" className="flex-1 text-lg font-bold">
              Find Markets
            </Button>
            <Button onClick={handleLocation} variant="outline" size="lg" className="text-sm">
              <MapPin className="w-4 h-4 mr-1" /> Use My Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-3">
          {results.map((market, i) => (
            <Card key={i}>
              <CardContent className="py-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{market.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {market.address}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {market.contact}
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary whitespace-nowrap">{market.distance}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketSelling;
