"use client";

import { AccountSettings } from "./account-settings";

interface DataPrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function DataPrivacyModal({ open, onClose }: DataPrivacyModalProps) {
  return <AccountSettings open={open} onClose={onClose} initialTab="privacy" />;
}
