import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettingByKey, useUpdateSetting } from "../../hooks/useQueries";

const settingKeys = [
  {
    key: "siteName",
    label: "Site Name",
    placeholder: "Master Detective Agency",
  },
  {
    key: "tagline",
    label: "Tagline",
    placeholder: "Unveiling Truth. Securing Clarity.",
  },
  { key: "logoUrl", label: "Logo URL", placeholder: "https://..." },
  { key: "themeColor", label: "Theme Color", placeholder: "#8B1E23" },
  {
    key: "whatsappNumber",
    label: "WhatsApp Number",
    placeholder: "919876543210",
  },
  { key: "callNumber", label: "Call Number", placeholder: "+919876543210" },
  {
    key: "address",
    label: "Office Address",
    placeholder: "221B Baker Street, New Delhi",
  },
  {
    key: "email",
    label: "Contact Email",
    placeholder: "info@masterdetective.in",
  },
  {
    key: "metaTitle",
    label: "Meta Title",
    placeholder: "Master Detective Agency - Professional Investigation",
  },
  {
    key: "metaDescription",
    label: "Meta Description",
    placeholder: "India's premier detective agency...",
  },
  {
    key: "metaKeywords",
    label: "Meta Keywords",
    placeholder: "detective, investigation, background check",
  },
];

function SettingField({
  settingKey,
  label,
  placeholder,
}: { settingKey: string; label: string; placeholder: string }) {
  const { data: setting } = useSettingByKey(settingKey);
  const updateSetting = useUpdateSetting();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (setting) setValue(setting.value);
  }, [setting]);

  const handleSave = async () => {
    try {
      await updateSetting.mutateAsync({ key: settingKey, value });
      toast.success(`${label} updated!`);
    } catch {
      toast.error(`Failed to update ${label}`);
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex gap-2">
        <Input
          className="input-detective flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          data-ocid="settings.input"
        />
        <Button
          onClick={handleSave}
          disabled={updateSetting.isPending}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-accent shrink-0"
          data-ocid="settings.save_button"
        >
          <Save className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          ⚙️ Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure site-wide settings
        </p>
      </div>

      <Card className="detective-card">
        <CardContent className="pt-6 space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Site Configuration
          </h2>
          {settingKeys.map((s) => (
            <SettingField
              key={s.key}
              settingKey={s.key}
              label={s.label}
              placeholder={s.placeholder}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
