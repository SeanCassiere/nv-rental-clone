import React from "react";
import { Sidenav, Nav, Navbar, Sidebar, Modal, Button, Dropdown } from "rsuite";

import AdvancedAnalyticsIcon from "@rsuite/icons/AdvancedAnalytics";
import DashboardIcon from "@rsuite/icons/Dashboard";
import SettingIcon from "@rsuite/icons/Setting";
import OthersIcon from "@rsuite/icons/Others";
import MoreIcon from "@rsuite/icons/More";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import BarLineChartIcon from "@rsuite/icons/BarLineChart";
import TableIcon from "@rsuite/icons/Table";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PeoplesCostomizeIcon from "@rsuite/icons/PeoplesCostomize";
import StorageIcon from "@rsuite/icons/Storage";

import { Link as RouterLink, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, selectAppConfigState } from "../../redux/store";
import { switchTheme } from "../../redux/slices/appConfigSlice";
import { resetAuthState } from "../../redux/slices/authUserSlice";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

const PrimaryComponent: React.FunctionComponent = () => {
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();

	const [showModal, setShowModal] = React.useState(false);

	const triggerShow = React.useCallback(() => {
		setShowModal(true);
	}, [setShowModal]);

	const triggerClose = React.useCallback(() => {
		setShowModal(false);
	}, [setShowModal]);

	const triggerLogOut = React.useCallback(() => {
		LOCAL_STORAGE_FUNCTIONS.clearLocalStorageTokens();
		dispatch(resetAuthState());
		history.push("/");
		setShowModal(false);
	}, [dispatch, history]);

	return (
		<>
			<Modal size='xs' open={showModal} onClose={triggerClose}>
				<Modal.Header>
					<Modal.Title>
						<b>Logout Warning</b>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you wish to logout?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={triggerLogOut} appearance='primary' className='background-primary'>
						Ok
					</Button>
					<Button onClick={triggerClose} appearance='subtle'>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
			<SideBarNavigation showLogoutModal={triggerShow} />
		</>
	);
};

const pagesKeyList = [
	"dashboard",
	"vehicles",
	"gps",
	"reservations",
	"customers",
	"agreements",
	"claims",
	"reports",
	"admin",
];

const SideBarNavigation: React.FunctionComponent<{ showLogoutModal: () => void }> = ({ showLogoutModal }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { theme } = useSelector(selectAppConfigState);
	const [expanded, setExpanded] = React.useState(false);
	const [activeKey, setActiveKey] = React.useState("dashboard");

	React.useEffect(() => {
		const urlLocation = window.location.pathname.split("/");
		if (pagesKeyList.includes(urlLocation[1])) {
			setActiveKey(urlLocation[1]);
		}
	}, []);

	React.useEffect(() => {
		const concernedElement = document.querySelector(".sidebar-app-container");

		const listenerFunc = (event: MouseEvent) => {
			if (!event.target) return;
			if (concernedElement === null) return;
			if (concernedElement.contains(event.target as Node)) {
				return;
			} else {
				setExpanded(false);
			}
		};

		document.addEventListener("mousedown", listenerFunc);

		return () => {
			document.removeEventListener("mousedown", listenerFunc);
		};
	}, []);

	const handleToggle = React.useCallback(() => {
		setExpanded((state) => !state);
	}, [setExpanded]);

	const handleSelect = React.useCallback(
		(eventKey: string) => {
			setActiveKey(eventKey);
		},
		[setActiveKey]
	);

	return (
		<div className='full-sidebar'>
			<Sidebar className='sidebar-app-container' width={expanded ? 250 : 56} collapsible>
				<Sidenav expanded={expanded} appearance='default' className='height-100-per'>
					<Sidenav.Header>
						<div className='sidebar-brand-container'>
							<AdvancedAnalyticsIcon style={{ verticalAlign: 0 }} />
							{expanded && <span style={{ marginLeft: 12 }}> BRAND</span>}
						</div>
					</Sidenav.Header>
					<Sidenav.Body>
						<Nav onSelect={handleSelect} activeKey={activeKey}>
							<Nav.Item eventKey='dashboard' icon={<DashboardIcon />} as={RouterLink} to='/dashboard'>
								Dashboard
							</Nav.Item>
							<Nav.Item eventKey='vehicles' icon={<StorageIcon />} as={RouterLink} to='/vehicles'>
								Vehicles
							</Nav.Item>
							{/* <Nav.Item eventKey='gps' icon={<Icon icon='explore' />} as={RouterLink} to='/gps'>
								GPS
							</Nav.Item> */}
							<Nav.Item eventKey='reservations' icon={<PeoplesCostomizeIcon />} as={RouterLink} to='/reservations'>
								Reservations
							</Nav.Item>
							<Nav.Item eventKey='customers' icon={<PeoplesIcon />} as={RouterLink} to='/customers'>
								Customers
							</Nav.Item>
							<Nav.Item eventKey='agreements' icon={<TableIcon />} as={RouterLink} to='/agreements'>
								Agreements
							</Nav.Item>
							{/* <Nav.Item eventKey='claims' icon={<Icon icon='plus-square' />} as={RouterLink} to='/claims'>
								Claims
							</Nav.Item> */}
							<Nav.Item eventKey='reports' icon={<BarLineChartIcon />} as={RouterLink} to='/reports'>
								Reports
							</Nav.Item>
							<Nav.Item eventKey='admin' icon={<SettingIcon />} as={RouterLink} to='/admin'>
								Admin
							</Nav.Item>
						</Nav>
					</Sidenav.Body>
				</Sidenav>

				<Navbar appearance='default' className='nav-toggle'>
					<Nav>
						<Dropdown placement='topStart' trigger='click'>
							<Dropdown.Item onClick={() => dispatch(switchTheme(theme))}>
								{theme === "light" ? <OthersIcon /> : <MoreIcon />}
								&nbsp;
								{theme === "light" ? <>Dark</> : <>Light</>}&nbsp;Mode
							</Dropdown.Item>
							<Dropdown.Item onClick={showLogoutModal}>
								<UnvisibleIcon />
								&nbsp;Sign out
							</Dropdown.Item>
						</Dropdown>
					</Nav>

					<Nav pullRight id='nav-switch'>
						<Nav.Item onClick={handleToggle} style={{ width: 56, textAlign: "center" }}>
							{expanded ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />}
						</Nav.Item>
					</Nav>
				</Navbar>
			</Sidebar>
		</div>
	);
};

// const iconStyles = {
// 	width: 56,
// 	height: 56,
// 	lineHeight: "56px",
// };

export default PrimaryComponent;
