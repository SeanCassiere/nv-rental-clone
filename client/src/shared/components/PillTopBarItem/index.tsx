import React from "react";
import styled from "styled-components";

const PillItem = ({
	keyLabel,
	valueLabel,
	isSearching,
}: {
	keyLabel: React.ReactNode;
	valueLabel: React.ReactNode;
	isSearching: boolean;
}) => {
	return (
		<PillContainer>
			<span className='label'>{keyLabel}</span>
			<span className='value'>
				{isSearching ? "Loading..." : valueLabel === null || valueLabel === "" ? <>&nbsp;</> : valueLabel}
			</span>
		</PillContainer>
	);
};

const PillContainer = styled.div`
	display: flex;
	width: 100%;
	height: max-content;
	margin-bottom: 5px;

	.label {
		min-width: 65px;
		text-align: center;
		height: inherit;
		padding: 5px 10px;
		display: inline-block;
		background-color: var(--primary-color);
		color: white;
		border: 1px solid var(--primary-color);
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.value {
		flex-grow: 1;
		height: 100%;
		display: inline-block;
		padding: 5px 10px;
		border: 1px solid var(--primary-color);
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
`;

export default React.memo(PillItem);
