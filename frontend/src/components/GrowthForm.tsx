import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NutritionalStatusBadge from './NutritionalStatusBadge';
import GrowthAlertBanner from './GrowthAlertBanner';
import { calculateBMI, classifyNutritionalStatus } from '../utils/growthCalculations';
import type { NutritionalStatus } from '../utils/dummyData';
import { CheckCircle2 } from 'lucide-react';

interface GrowthFormResult {
  name: string;
  bmi: number;
  status: NutritionalStatus;
}

export default function GrowthForm() {
  const [name, setName] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [muac, setMuac] = useState('');
  const [result, setResult] = useState<GrowthFormResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Child name is required';
    if (!ageMonths || isNaN(Number(ageMonths)) || Number(ageMonths) < 0 || Number(ageMonths) > 60)
      newErrors.ageMonths = 'Enter valid age (0–60 months)';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!height || isNaN(Number(height)) || Number(height) < 40 || Number(height) > 130)
      newErrors.height = 'Enter valid height (40–130 cm)';
    if (!weight || isNaN(Number(weight)) || Number(weight) < 2 || Number(weight) > 30)
      newErrors.weight = 'Enter valid weight (2–30 kg)';
    if (muac && (isNaN(Number(muac)) || Number(muac) < 5 || Number(muac) > 25))
      newErrors.muac = 'Enter valid MUAC (5–25 cm)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const bmi = calculateBMI(Number(weight), Number(height));
    const status = classifyNutritionalStatus(bmi, Number(ageMonths), muac ? Number(muac) : undefined);
    setResult({ name: name.trim(), bmi, status });
  };

  const handleReset = () => {
    setName(''); setAgeMonths(''); setGender(''); setHeight(''); setWeight(''); setMuac('');
    setResult(null); setErrors({});
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <img src="/assets/generated/growth-icon.dim_128x128.png" alt="" className="w-6 h-6 rounded" />
          Add Growth Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-status-green">
              <CheckCircle2 size={20} />
              <span className="font-semibold">Assessment Complete</span>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Child Name</span>
                <span className="font-semibold">{result.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">BMI</span>
                <span className="font-bold text-lg">{result.bmi}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <NutritionalStatusBadge status={result.status} />
              </div>
            </div>
            <GrowthAlertBanner status={result.status} childName={result.name} />
            <Button onClick={handleReset} variant="outline" className="w-full">
              Add Another Record
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="childName">Child Name *</Label>
                <Input
                  id="childName"
                  placeholder="Enter child's name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-11"
                />
                {errors.name && <p className="text-xs text-status-red">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="ageMonths">Age (months) *</Label>
                <Input
                  id="ageMonths"
                  type="number"
                  placeholder="e.g. 24"
                  value={ageMonths}
                  onChange={e => setAgeMonths(e.target.value)}
                  className="h-11"
                />
                {errors.ageMonths && <p className="text-xs text-status-red">{errors.ageMonths}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-status-red">{errors.gender}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 85"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="h-11"
                />
                {errors.height && <p className="text-xs text-status-red">{errors.height}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="h-11"
                />
                {errors.weight && <p className="text-xs text-status-red">{errors.weight}</p>}
              </div>

              <div className="col-span-2 space-y-1">
                <Label htmlFor="muac">MUAC (cm) <span className="text-muted-foreground text-xs">Optional</span></Label>
                <Input
                  id="muac"
                  type="number"
                  step="0.1"
                  placeholder="Mid-upper arm circumference"
                  value={muac}
                  onChange={e => setMuac(e.target.value)}
                  className="h-11"
                />
                {errors.muac && <p className="text-xs text-status-red">{errors.muac}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold">
              Calculate & Assess
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
