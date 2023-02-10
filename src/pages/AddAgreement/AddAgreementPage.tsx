import AddAgreement from "../../components/AddRental/AddAgreement";
import Protector from "../../components/Protector";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { titleMaker } from "../../utils/title-maker";

const AddAgreementPage = () => {
  useDocumentTitle(titleMaker("Add Agreement"));
  return (
    <Protector>
      <AddAgreement agreementId={0} />
    </Protector>
  );
};

export default AddAgreementPage;
