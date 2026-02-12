import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states, districtsByState, mockSchemes } from "@/data/mockData";
import { Landmark } from "lucide-react";

const GovernmentSchemes = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [caste, setCaste] = useState("");
  const [gender, setGender] = useState("");
  const [landSize, setLandSize] = useState("");
  const [results, setResults] = useState<typeof mockSchemes | null>(null);

  const handleFind = () => setResults(mockSchemes);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Landmark className="w-8 h-8 text-primary" /> Find Your Benefits
        </h2>
        <p className="text-muted-foreground mt-1">Filter government schemes based on your profile.</p>
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
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Caste Category</label>
              <Select value={caste} onValueChange={setCaste}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {["General", "OBC", "SC", "ST"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Land Size (Hectares)</label>
            <Input type="number" placeholder="e.g. 2.5" value={landSize} onChange={(e) => setLandSize(e.target.value)} />
          </div>
          <Button onClick={handleFind} size="lg" className="w-full text-lg font-bold">
            Find Schemes
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-4">
          {results.map((scheme) => (
            <Card key={scheme.id} className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">{scheme.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-foreground text-sm">{scheme.description}</p>
                <p className="text-xs text-muted-foreground">Eligibility: {scheme.eligibility}</p>
                <Button size="sm" className="mt-2">Apply Now →</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;
