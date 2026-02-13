import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states, districtsByState } from "@/data/mockData";
import { Store, MapPin, Phone, Loader2, AlertCircle } from "lucide-react";

interface MarketListing {
  id: number;
  crop_name: string;
  quantity: number;
  unit: string;
  expected_price: number;
  state: string;
  district: string;
  description: string;
  seller_name: string;
  seller_phone: string;
  created_at: string;
}

const MarketSelling = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState<MarketListing[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyMarkets, setNearbyMarkets] = useState<any[] | null>(null);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [marketsError, setMarketsError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams();
      const norm = (v: any) => typeof v === 'object' && v !== null ? (v.value ?? v.label ?? '') : v ?? '';
      const sVal = norm(state);
      const dVal = norm(district);
      if (sVal) params.append('state', sVal);
      if (dVal) params.append('district', dVal);

      const response = await fetch(`http://127.0.0.1:8000/api/market/listings/?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      // API uses paginated response: { count, results: [...] }
      const listings = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
      setResults(listings);

      // also fetch nearby mandi markets for the selected area - pass explicit values
      handleFetchMarkets(sVal, dVal);
    } catch (err) {
      setError('Failed to fetch listings. Please try again.');
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocation = () => {
    setState("Maharashtra");
    setDistrict("Pune");
    handleSearch();
  };

  const handleFetchMarkets = async (stateParam?: any, districtParam?: any) => {
    setMarketsLoading(true);
    setMarketsError(null);
    setNearbyMarkets(null);

    try {
      const params = new URLSearchParams();
      params.append('format', 'json');
      params.append('limit', '100');
      const norm = (v: any) => typeof v === 'object' && v !== null ? (v.value ?? v.label ?? '') : v ?? '';
      const s = norm(stateParam ?? state);
      const d = norm(districtParam ?? district);
      if (s) params.append('filters[state.keyword]', s);
      if (d) params.append('filters[district]', d);

      const resp = await fetch(`http://127.0.0.1:8000/api/market/mandi/?${params.toString()}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      const records = data && Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : []);
      const synthetic = (data && Array.isArray((data as any).synthetic_markets)) ? (data as any).synthetic_markets : [];

      // If external records are empty, use fallback_listings returned by backend
      if ((!records || records.length === 0) && Array.isArray((data as any).fallback_listings) && (data as any).fallback_listings.length > 0) {
        const fallback = (data as any).fallback_listings;
        // build nearby markets list from fallback listings (use title/address)
        const map = new Map<string, any>();
        fallback.forEach((f: any) => {
          const marketName = f.title || f.address || `${f.seller || 'Seller'} Listing`;
          const districtName = f.district || '';
          const stateName = f.state || '';
          const key = `${marketName}||${districtName}||${stateName}`;
          if (!map.has(key)) map.set(key, { market: marketName, district: districtName, state: stateName });
        });
        setNearbyMarkets(Array.from(map.values()));
        return;
      }

      // otherwise extract unique markets by name + district from records (only when records exist)
      if (records && records.length > 0) {
        const map = new Map<string, any>();
        records.forEach((r: any) => {
          const marketName = r.market || r.Market || r.market_name || r.MARKET || '';
          const districtName = r.district || r.district_name || '';
          const stateName = r.state || r.state_name || '';
          if (!marketName) return;
          const key = `${marketName}||${districtName}||${stateName}`;
          if (!map.has(key)) {
            map.set(key, { market: marketName, district: districtName, state: stateName });
          }
        });

        setNearbyMarkets(Array.from(map.values()));
        return;
      }

      // If backend provided synthetic (AI-suggested) markets, and there are no real records/fallbacks, use them
      if ((!records || records.length === 0) && (!Array.isArray((data as any).fallback_listings) || (data as any).fallback_listings.length === 0) && synthetic && synthetic.length > 0) {
        const mapS = new Map<string, any>();
        synthetic.forEach((s: any) => {
          const marketName = s.market || '';
          const districtName = s.district || '';
          const stateName = s.state || '';
          const key = `${marketName}||${districtName}||${stateName}`;
          if (!mapS.has(key)) mapS.set(key, { market: marketName, district: districtName, state: stateName, synthetic: true });
        });
        setNearbyMarkets(Array.from(mapS.values()));
        return;
      }
    } catch (err) {
      console.error('Markets fetch error', err);
      setMarketsError('Failed to fetch nearby markets.');
    } finally {
      setMarketsLoading(false);
    }
  };

  const handleViewMarket = async (marketName: string, stateParam?: string, districtParam?: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams();
      const s = stateParam ?? state;
      const d = districtParam ?? district;
      if (s) params.append('state', s);
      if (d) params.append('district', d);

      const resp = await fetch(`http://127.0.0.1:8000/api/market/listings/?${params.toString()}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const listings = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);

      const nameLower = marketName.toLowerCase();
      const filtered = listings.filter((l: any) => {
        const title = (l.title || l.crop_name || '').toString().toLowerCase();
        const address = (l.address || '').toString().toLowerCase();
        return title.includes(nameLower) || address.includes(nameLower);
      });

      setResults(filtered);
      // scroll to listings area (optional)
      window.scrollTo({ top: 600, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to load listings for market.');
      console.error('View market error', err);
    } finally {
      setIsLoading(false);
    }
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
            <Button onClick={handleSearch} size="lg" className="flex-1 text-lg font-bold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Find Markets'
              )}
            </Button>
            <Button onClick={handleLocation} variant="outline" size="lg" className="text-sm" disabled={isLoading}>
              <MapPin className="w-4 h-4 mr-1" /> Use My Location
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Nearby Markets</h3>
            <Button onClick={handleFetchMarkets} size="sm" disabled={marketsLoading}>
              {marketsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Find Nearby Markets'
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Shows nearby mandi / market locations for the selected state and district.</p>
        </CardContent>
      </Card>

      {marketsError && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{marketsError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {nearbyMarkets && nearbyMarkets.length === 0 && !marketsError && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">No nearby markets found for the selected location</span>
            </div>
          </CardContent>
        </Card>
      )}

      {nearbyMarkets && nearbyMarkets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Nearby Markets ({nearbyMarkets.length})</h3>
          {nearbyMarkets.some(m => (m as any).synthetic) && (
            <div className="text-xs text-muted-foreground mt-1">These markets are AI-suggested. Verify before relying on them.</div>
          )}
          {nearbyMarkets.map((m, idx) => (
            <Card key={idx}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold">{m.market} {(m as any).synthetic && <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">AI</span>}</div>
                  <div className="text-sm text-muted-foreground">{m.district}{m.district ? ', ' : ''}{m.state}</div>
                </div>
                <div>
                  <Button size="sm" onClick={() => handleViewMarket(m.market, m.state, m.district)}>View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

      {results && results.length === 0 && !error && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">No listings found for the selected location</span>
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{results.length} Listings Found</h3>
          {results.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="py-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{listing.crop_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.quantity} {listing.unit} • ₹{listing.expected_price}/{listing.unit}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {listing.district}, {listing.state}
                  </p>
                  {listing.description && (
                    <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{listing.seller_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                    <Phone className="w-3 h-3" /> {listing.seller_phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketSelling;
