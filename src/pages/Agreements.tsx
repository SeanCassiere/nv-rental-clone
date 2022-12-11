import { Link, useSearch } from "@tanstack/react-router";
import { useGetAgreementsList } from "../hooks/network/useGetAgreementsList";
import Protector from "../routes/Protector";

const Agreements = () => {
  const { page: pageNumber = 1, size = 10 } = useSearch();
  const agreements = useGetAgreementsList({ page: pageNumber, pageSize: size });

  const noData = { ...agreements.data, data: undefined };
  return (
    <Protector>
      <h1 className="text-red-400">Agreements</h1>
      <p>
        <Link to="/">Home Page</Link>
      </p>
      <Link
        to="/agreements"
        search={(search) => ({
          ...search,
          page: pageNumber <= 1 ? 1 : pageNumber - 1,
          size,
        })}
      >
        Page -1
      </Link>
      <Link
        to="/agreements"
        search={(search) => ({ ...search, page: pageNumber + 1, size })}
      >
        Page +1
      </Link>
      <div className="mt-5 text-sm">{JSON.stringify(noData)}</div>
      <div className="mt-10">
        {agreements.data.data.map((agreement) => (
          <div key={agreement.AgreementId} className="flex gap-2">
            <span>{agreement.AgreementNumber}</span>
            <span>{agreement.AgreementStatusName}</span>
          </div>
        ))}
      </div>
    </Protector>
  );
};

export default Agreements;
