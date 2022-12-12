import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
function AgreementViewPage() {
  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              AgreementView
            </h1>
          </div>

          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            Hello world
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default AgreementViewPage;
