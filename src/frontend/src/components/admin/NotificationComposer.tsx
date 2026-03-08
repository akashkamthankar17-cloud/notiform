import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { generateId } from "../../lib/utils";
import type { NotificationType } from "../../types";

export default function NotificationComposer() {
  const { addNotification } = useAppContext();
  const [recipientType, setRecipientType] = useState<"broadcast" | "targeted">(
    "broadcast",
  );
  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "new_form" as NotificationType,
    formId: "",
    recipientId: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.body.trim()) errs.body = "Message body is required";
    if (recipientType === "targeted" && !form.recipientId.trim())
      errs.recipientId = "Recipient ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    addNotification({
      id: generateId(),
      userId: recipientType === "broadcast" ? "broadcast" : form.recipientId,
      title: form.title,
      body: form.body,
      type: form.type,
      formId: form.formId || undefined,
      isRead: false,
      createdAt: new Date(),
    });
    setLoading(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({
        title: "",
        body: "",
        type: "new_form",
        formId: "",
        recipientId: "",
      });
    }, 2000);
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Send className="w-4 h-4 text-nf-primary" />
          Send Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Recipient Type</Label>
          <RadioGroup
            value={recipientType}
            onValueChange={(v) =>
              setRecipientType(v as "broadcast" | "targeted")
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="broadcast" id="broadcast" />
              <Label htmlFor="broadcast" className="cursor-pointer">
                Broadcast (All Users)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="targeted" id="targeted" />
              <Label htmlFor="targeted" className="cursor-pointer">
                Targeted (Specific User)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {recipientType === "targeted" && (
          <div className="space-y-1.5">
            <Label>Recipient Principal ID *</Label>
            <Input
              value={form.recipientId}
              onChange={(e) =>
                setForm((p) => ({ ...p, recipientId: e.target.value }))
              }
              placeholder="Enter user principal ID"
            />
            {errors.recipientId && (
              <p className="text-xs text-red-500">{errors.recipientId}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Notification Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, type: v as NotificationType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_form">New Form</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="personalized">Personalized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Related Form ID (optional)</Label>
            <Input
              value={form.formId}
              onChange={(e) =>
                setForm((p) => ({ ...p, formId: e.target.value }))
              }
              placeholder="Form ID"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Notification title"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Message *</Label>
          <Textarea
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder="Notification message body"
            rows={3}
          />
          {errors.body && <p className="text-xs text-red-500">{errors.body}</p>}
        </div>

        <Button
          onClick={handleSend}
          disabled={loading || sent}
          className="w-full gradient-primary text-white border-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : sent ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Sent Successfully!
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
