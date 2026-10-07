"use client";

import { AccountSettings } from "./account-settings";

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  return <AccountSettings open={open} onClose={onClose} initialTab="support" />;
}
