import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Download, Clock } from 'lucide-react';

export default function ExportReportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full h-11 font-semibold gap-2"
        variant="outline"
      >
        <Download size={18} />
        Export Monthly Report
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock size={20} className="text-accent" />
              Feature Coming Soon
            </DialogTitle>
            <DialogDescription className="text-left pt-2">
              <p>Report export functionality will be available in the next update.</p>
              <div className="bg-muted rounded-lg p-3 mt-3 space-y-1 text-sm">
                <p className="font-medium">Planned export formats:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Monthly Growth Report (PDF)</li>
                  <li>• Attendance Register (CSV)</li>
                  <li>• Risk Summary Sheet (PDF)</li>
                </ul>
              </div>
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
