import React from "react";
import { Button, Icon } from "rsuite";

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
						<Icon icon='chevron-left' />
					</Button>
					&nbsp;
				</>
			)}
			{title}
			{refresh && refreshFunction && (
				<>
					&nbsp;
					<Button onClick={refreshFunction}>
						<Icon icon='refresh' />
					</Button>
				</>
			)}
		</h5>
	);
});

export default ViewPageHeader;
