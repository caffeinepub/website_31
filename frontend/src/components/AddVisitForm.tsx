import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddVisit } from '../hooks/useQueries';
import { dateToNanoTimestamp } from '../utils/gestationalCalculations';

interface AddVisitFormProps {
  phoneNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface VisitFormValues {
  visitDate: string;
  weight: string;
  bloodPressure: string;
  hemoglobin: string;
  notes: string;
}

export default function AddVisitForm({ phoneNumber, onSuccess, onCancel }: AddVisitFormProps) {
  const addVisit = useAddVisit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitFormValues>({
    defaultValues: {
      visitDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: VisitFormValues) => {
    try {
      const visitDate = new Date(data.visitDate);
      await addVisit.mutateAsync({
        phoneNumber,
        newVisit: {
          visitDate: dateToNanoTimestamp(visitDate),
          weight: parseFloat(data.weight),
          bloodPressure: BigInt(parseInt(data.bloodPressure, 10)),
          hemoglobin: parseFloat(data.hemoglobin),
          notes: data.notes,
        },
      });
      toast.success('Visit recorded successfully');
      onSuccess();
    } catch (err) {
      toast.error('Failed to record visit. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="visitDate">Visit Date</Label>
          <Input
            id="visitDate"
            type="date"
            {...register('visitDate', { required: 'Visit date is required' })}
          />
          {errors.visitDate && (
            <p className="text-xs text-destructive">{errors.visitDate.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 58.5"
            {...register('weight', {
              required: 'Weight is required',
              min: { value: 30, message: 'Min 30 kg' },
              max: { value: 120, message: 'Max 120 kg' },
            })}
          />
          {errors.weight && (
            <p className="text-xs text-destructive">{errors.weight.message}</p>
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
          <Label htmlFor="hemoglobin">Haemoglobin (g/dL)</Label>
          <Input
            id="hemoglobin"
            type="number"
            step="0.1"
            placeholder="e.g. 10.5"
            {...register('hemoglobin', {
              required: 'Haemoglobin is required',
              min: { value: 4, message: 'Min 4' },
              max: { value: 20, message: 'Max 20' },
            })}
          />
          {errors.hemoglobin && (
            <p className="text-xs text-destructive">{errors.hemoglobin.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Visit observations, advice given, referrals..."
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
          disabled={addVisit.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={addVisit.isPending}>
          {addVisit.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              Saving…
            </>
          ) : (
            'Record Visit'
          )}
        </Button>
      </div>
    </form>
  );
}
