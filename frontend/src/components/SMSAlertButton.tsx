import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MessageSquare, CheckCircle2 } from 'lucide-react';

interface SMSAlertButtonProps {
  childName: string;
  parentName: string;
  parentPhone: string;
}

export default function SMSAlertButton({ childName, parentName, parentPhone }: SMSAlertButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleSend}
        className="w-full h-11 font-semibold gap-2"
        variant="outline"
      >
        <MessageSquare size={18} />
        Send SMS Alert to Parent
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-green">
              <CheckCircle2 size={20} />
              SMS Alert Sent to Parent
            </DialogTitle>
            <DialogDescription className="text-left space-y-2 pt-2">
              <p>An SMS alert has been simulated for:</p>
              <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Child:</span> <strong>{childName}</strong></p>
                <p><span className="text-muted-foreground">Parent:</span> <strong>{parentName}</strong></p>
                <p><span className="text-muted-foreground">Phone:</span> <strong>{parentPhone}</strong></p>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: This is a UI simulation. Real SMS integration requires backend connectivity.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOpen(false)} className="w-full mt-2">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
