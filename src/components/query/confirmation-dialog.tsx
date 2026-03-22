'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  open: boolean;
  sql: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ open, sql, onConfirm, onCancel }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Confirm SQL Execution</DialogTitle>
          <DialogDescription>
            Please review the SQL below before executing. This query will run against your data.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[40vh] overflow-auto">
          <pre className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">{sql}</pre>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Execute</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}