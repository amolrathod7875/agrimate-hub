import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { states, districtsByState } from "@/data/mockData";
import { useProfile } from "@/contexts/ProfileContext";
import { UserCircle, MapPin, Camera } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState({ ...profile });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm((prev) => ({ ...prev, avatar: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile(form);
    toast.success("Profile saved successfully!");
  };

  const handleDetectLocation = () => {
    setForm((prev) => ({ ...prev, location: "Pune, Maharashtra (Detected)" }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <UserCircle className="w-8 h-8 text-primary" /> Farmer Profile
        </h2>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Avatar className="w-28 h-28 border-4 border-primary/30">
                {form.avatar ? (
                  <AvatarImage src={form.avatar} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {form.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])} />
            <p className="text-xs text-muted-foreground">Click to upload photo</p>
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter your name" />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} placeholder="e.g. 35" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="mb-2 block">Gender</Label>
            <RadioGroup value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))} className="flex gap-6">
              {["Male", "Female", "Other"].map((g) => (
                <div key={g} className="flex items-center gap-2">
                  <RadioGroupItem value={g} id={g} />
                  <Label htmlFor={g}>{g}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">State</Label>
              <Select value={form.state} onValueChange={(v) => setForm((p) => ({ ...p, state: v, district: "" }))}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">District</Label>
              <Select value={form.district} onValueChange={(v) => setForm((p) => ({ ...p, district: v }))} disabled={!form.state}>
                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                <SelectContent>{(districtsByState[form.state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="mb-1 block">Current Location</Label>
            <div className="flex gap-2">
              <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Enter location" className="flex-1" />
              <Button variant="outline" onClick={handleDetectLocation} size="sm">
                <MapPin className="w-4 h-4 mr-1" /> Detect
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} size="lg" className="w-full text-lg font-bold">
            💾 Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
