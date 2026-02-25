import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAddPregnancyRecord } from '../hooks/useQueries';
import {
  calculateGestationalAge,
  calculateEDD,
  determineTrimester,
  dateToNanoTimestamp,
} from '../utils/gestationalCalculations';
import { RiskLevel } from '../backend';

interface RegistrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  age: string;
  husbandName: string;
  address: string;
  phoneNumber: string;
  lmpDate: string;
  weight: string;
  hemoglobinLevel: string;
  bloodPressure: string;
  riskLevel: string;
  notes: string;
}

export default function PregnantWomanRegistrationForm({
  onSuccess,
  onCancel,
}: RegistrationFormProps) {
  const addRecord = useAddPregnancyRecord();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const lmpDateValue = watch('lmpDate');

  const getComputedValues = () => {
    if (!lmpDateValue) return null;
    const lmp = new Date(lmpDateValue);
    if (isNaN(lmp.getTime())) return null;
    const gestAge = calculateGestationalAge(lmp);
    const edd = calculateEDD(lmp);
    const trimester = determineTrimester(gestAge);
    return { gestAge, edd, trimester };
  };

  const computed = getComputedValues();

  const onSubmit = async (data: FormValues) => {
    if (!computed) {
      toast.error('Please enter a valid LMP date.');
      return;
    }

    const lmp = new Date(data.lmpDate);
    const riskLevelMap: Record<string, RiskLevel> = {
      normal: RiskLevel.normal,
      moderate: RiskLevel.moderate,
      high: RiskLevel.high,
    };

    const riskLevel = riskLevelMap[data.riskLevel];
    if (!riskLevel) {
      toast.error('Please select a risk level.');
      return;
    }

    try {
      await addRecord.mutateAsync({
        name: data.name,
        age: BigInt(parseInt(data.age, 10)),
        husbandName: data.husbandName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        lmpDate: dateToNanoTimestamp(lmp),
        eddDate: dateToNanoTimestamp(computed.edd),
        gestationalAge: BigInt(computed.gestAge),
        weight: parseFloat(data.weight),
        hemoglobinLevel: parseFloat(data.hemoglobinLevel),
        bloodPressure: BigInt(parseInt(data.bloodPressure, 10)),
        trimester: BigInt(computed.trimester),
        riskLevel,
        initialVisit: {
          visitDate: dateToNanoTimestamp(new Date()),
          weight: parseFloat(data.weight),
          bloodPressure: BigInt(parseInt(data.bloodPressure, 10)),
          hemoglobin: parseFloat(data.hemoglobinLevel),
          notes: data.notes || 'Initial registration visit.',
        },
      });
      toast.success(`${data.name} registered successfully`);
      onSuccess();
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Personal Details */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Personal Details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="e.g. Sunita Devi"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g. 25"
            {...register('age', {
              required: 'Age is required',
              min: { value: 15, message: 'Min 15' },
              max: { value: 50, message: 'Max 50' },
            })}
          />
          {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="husbandName">Husband's Name</Label>
          <Input
            id="husbandName"
            placeholder="e.g. Ramesh Kumar"
            {...register('husbandName', { required: "Husband's name is required" })}
          />
          {errors.husbandName && (
            <p className="text-xs text-destructive">{errors.husbandName.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Village / Ward / District"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="10-digit mobile number"
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' },
            })}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      {/* Pregnancy Details */}
      <div className="space-y-1 pt-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Pregnancy Details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="lmpDate">Last Menstrual Period (LMP)</Label>
          <Input
            id="lmpDate"
            type="date"
            {...register('lmpDate', { required: 'LMP date is required' })}
          />
          {errors.lmpDate && <p className="text-xs text-destructive">{errors.lmpDate.message}</p>}
        </div>

        {computed && (
          <div className="col-span-2 bg-secondary/50 border border-primary/20 rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Gestational Age</p>
              <p className="font-bold text-sm text-primary">{computed.gestAge} wks</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trimester</p>
              <p className="font-bold text-sm text-primary">{computed.trimester}{computed.trimester === 1 ? 'st' : computed.trimester === 2 ? 'nd' : 'rd'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">EDD</p>
              <p className="font-bold text-sm text-primary">
                {computed.edd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 55.0"
            {...register('weight', {
              required: 'Weight is required',
              min: { value: 30, message: 'Min 30 kg' },
              max: { value: 120, message: 'Max 120 kg' },
            })}
          />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="hemoglobinLevel">Haemoglobin (g/dL)</Label>
          <Input
            id="hemoglobinLevel"
            type="number"
            step="0.1"
            placeholder="e.g. 10.5"
            {...register('hemoglobinLevel', {
              required: 'Haemoglobin is required',
              min: { value: 4, message: 'Min 4' },
              max: { value: 20, message: 'Max 20' },
            })}
          />
          {errors.hemoglobinLevel && (
            <p className="text-xs text-destructive">{errors.hemoglobinLevel.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="bloodPressure">BP Systolic (mmHg)</Label>
          <Input
            id="bloodPressure"
            type="number"
            placeholder="e.g. 120"
            {...register('bloodPressure', {
              required: 'Blood pressure is required',
              min: { value: 60, message: 'Min 60' },
              max: { value: 200, message: 'Max 200' },
            })}
          />
          {errors.bloodPressure && (
            <p className="text-xs text-destructive">{errors.bloodPressure.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="riskLevel">Risk Level</Label>
          <Select onValueChange={(val) => setValue('riskLevel', val)}>
            <SelectTrigger id="riskLevel">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="moderate">Moderate Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
          {errors.riskLevel && (
            <p className="text-xs text-destructive">{errors.riskLevel.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="notes">Initial Visit Notes</Label>
          <Textarea
            id="notes"
            placeholder="Observations, advice given, referrals..."
            rows={3}
            {...register('notes')}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={addRecord.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={addRecord.isPending}>
          {addRecord.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              Registering…
            </>
          ) : (
            'Register'
          )}
        </Button>
      </div>
    </form>
  );
}
