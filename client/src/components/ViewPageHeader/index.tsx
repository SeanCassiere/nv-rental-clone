import React from "react";
import { Button, Icon } from "rsuite";

const ViewPageHeader: React.FunctionComponent<{
	goBackFunction?: () => void;
	refreshFunction?: () => void;
	back?: true;
	refresh?: true;
	title: string | React.ReactNode;
}> = React.memo(({ goBackFunction, refreshFunction, back, refresh, title }) => {
	return (
		<h5>
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
