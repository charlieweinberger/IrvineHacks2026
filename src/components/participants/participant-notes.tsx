"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ParticipantNotesProps {
  extraComments?: string;
  appNotes: string;
  needsReview?: boolean;
  reviewApproved?: boolean;
  forceEditMode?: boolean;
  onReviewApprovalChange?: (approved: boolean) => void;
}

export const ParticipantNotes = forwardRef<
  { getValue: () => string },
  ParticipantNotesProps
>(({ extraComments, appNotes, needsReview = false, reviewApproved = false, forceEditMode = false, onReviewApprovalChange }, ref) => {
  const [note, setNote] = useState(appNotes);
  const [approved, setApproved] = useState(reviewApproved);

  // Sync state when props change
  useEffect(() => {
    setNote(appNotes);
  }, [appNotes]);
  
  useEffect(() => {
    setApproved(reviewApproved);
  }, [reviewApproved]);
  
  const handleApprovalChange = (checked: boolean) => {
    setApproved(checked);
    onReviewApprovalChange?.(checked);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => note.trim(),
  }));

  return (
    <>
      {extraComments && (
        <div className="text-xs flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-zinc-700">Extra Comments: </span>
          <span className="text-zinc-600">{extraComments}</span>
          {needsReview && !approved && (
            <Badge variant="warning" className="text-[10px] py-0 px-1.5">
              Needs Review
            </Badge>
          )}
          {needsReview && approved && (
            <Badge variant="success" className="text-[10px] py-0 px-1.5">
              Reviewed
            </Badge>
          )}
          {needsReview && forceEditMode && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => handleApprovalChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300"
              />
              <span className="text-[10px] text-zinc-600">Mark as reviewed</span>
            </label>
          )}
        </div>
      )}
      {!forceEditMode && (
        <div className="text-xs">
          <span className="font-semibold text-zinc-700">Officer Note: </span>
          <span className="text-zinc-600">
            {appNotes || ""}
          </span>
        </div>
      )}
      {forceEditMode && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap">
            Officer Note:
          </span>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add officer note"
            autoFocus
          />
        </div>
      )}
    </>
  );
});

ParticipantNotes.displayName = "ParticipantNotes";
