import React from "react";
import { Link } from "react-router-dom";
import { IR_AvailableReport } from "../../shared/interfaces/reports/availableReport";
import { IR_ReportFolder } from "../../shared/interfaces/reports/folder";

interface I_DemoDisplayReportsTree {
	folders: IR_ReportFolder[];
	reports: IR_AvailableReport[];
}

const DemoDisplayReportsTree = ({ folders, reports }: I_DemoDisplayReportsTree) => {
	return (
		<div>
			{folders.map((folder) => (
				<div key={`report-folder-${folder.reportFolderId}`}>
					<p>{folder.folderName}</p>
					<ul>
						{reports.map((rep) => {
							if (rep.folderId !== folder.reportFolderId) return null;

							return (
								<li key={`report-${rep.reportId}`}>
									<Link to={`/reports/${rep.reportId}`}>{rep.name}</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</div>
	);
};

export default React.memo(DemoDisplayReportsTree);
