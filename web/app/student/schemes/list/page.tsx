import { T } from "@/components/T";
import { StudentShell } from "@/components/shell/StudentShell";

export default function Page() {
  return (
    <StudentShell>
      <div className="p-6">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
          <T gu="યોજનાઓ" en="Schemes" hi="Schemes" />
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <T gu="આ પૃષ્ઠ આગામી તબક્કામાં રૂપાંતરિત થશે." en="This page will be converted in Phase 3." hi="यह पृष्ठ अगले चरण में तैयार किया जाएगा।" />
        </p>
      </div>
    </StudentShell>
  );
}
