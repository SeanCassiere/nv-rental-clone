import React from "react";
import { Button } from "rsuite";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import CloudReflashIcon from "@rsuite/icons/CloudReflash";

const ViewPageHeader: React.FunctionComponent<{
	goBackFunction?: () => void;
	refreshFunction?: () => void;
	back?: true;
	refresh?: true;
	small?: true;
	title: string | React.ReactNode;
}> = React.memo(({ goBackFunction, refreshFunction, back, refresh, title, small }) => {
	return (
		<h5 style={{ fontSize: small ? "1em" : "1.2em", fontWeight: small ? 500 : 900 }}>
			{back && goBackFunction && (
				<>
					<Button onClick={goBackFunction}>
						<ArrowLeftLineIcon />
					</Button>
					&nbsp;
				</>
			)}
			{title}
			{refresh && refreshFunction && (
				<>
					&nbsp;
					<Button onClick={refreshFunction}>
						<CloudReflashIcon />
					</Button>
				</>
			)}
		</h5>
	);
});

export default ViewPageHeader;
