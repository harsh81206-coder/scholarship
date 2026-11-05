import { T } from "@/components/T";
import { OfficerShell } from "@/components/shell/OfficerShell";

export default function Page() {
  return (
    <OfficerShell role="vendor">
      <div className="p-6">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
          <T gu="ડિલિવરી ચલણ" en="Delivery Challan" hi="Delivery Challan" />
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <T gu="આ પૃષ્ઠ Phase 3 માં રૂપાંતરિત થશે." en="This page will be converted in Phase 3." hi="यह पृष्ठ Phase 3 में बदला जाएगा।" />
        </p>
      </div>
    </OfficerShell>
  );
}
