import React from "react";
import { Sidenav, Nav, Icon, Navbar, Sidebar, Modal, Button, Dropdown } from "rsuite";

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
			<Modal size='xs' show={showModal} onHide={triggerClose}>
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
				<Sidenav
					expanded={expanded}
					activeKey={activeKey}
					onSelect={handleSelect}
					appearance='default'
					className='height-100-per'
				>
					<Sidenav.Header>
						<div className='sidebar-brand-container'>
							<Icon icon='logo-analytics' size='lg' style={{ verticalAlign: 0 }} />
							<span style={{ marginLeft: 12 }}> BRAND</span>
						</div>
					</Sidenav.Header>
					<Sidenav.Body>
						<Nav>
							<Nav.Item
								eventKey='dashboard'
								icon={<Icon icon='dashboard' />}
								componentClass={RouterLink}
								to='/dashboard'
							>
								Dashboard
							</Nav.Item>
							<Nav.Item eventKey='vehicles' icon={<Icon icon='car' />} componentClass={RouterLink} to='/vehicles'>
								Vehicles
							</Nav.Item>
							{/* <Nav.Item eventKey='gps' icon={<Icon icon='explore' />} componentClass={RouterLink} to='/gps'>
								GPS
							</Nav.Item> */}
							<Nav.Item
								eventKey='reservations'
								icon={<Icon icon='order-form' />}
								componentClass={RouterLink}
								to='/reservations'
							>
								Reservations
							</Nav.Item>
							<Nav.Item eventKey='customers' icon={<Icon icon='group' />} componentClass={RouterLink} to='/customers'>
								Customers
							</Nav.Item>
							<Nav.Item
								eventKey='agreements'
								icon={<Icon icon='signing' />}
								componentClass={RouterLink}
								to='/agreements'
							>
								Agreements
							</Nav.Item>
							{/* <Nav.Item eventKey='claims' icon={<Icon icon='plus-square' />} componentClass={RouterLink} to='/claims'>
								Claims
							</Nav.Item> */}
							<Nav.Item eventKey='reports' icon={<Icon icon='line-chart' />} componentClass={RouterLink} to='/reports'>
								Reports
							</Nav.Item>
							<Nav.Item eventKey='admin' icon={<Icon icon='gear-circle' />} componentClass={RouterLink} to='/admin'>
								Admin
							</Nav.Item>
						</Nav>
					</Sidenav.Body>
				</Sidenav>

				<Navbar appearance='default' className='nav-toggle'>
					<Navbar.Body>
						<Nav>
							<Dropdown
								placement='topStart'
								trigger='click'
								renderTitle={() => {
									return <Icon style={{ ...iconStyles, textAlign: "center" }} icon='cog' />;
								}}
							>
								<Dropdown.Item onClick={() => dispatch(switchTheme(theme))}>
									<Icon icon={theme === "light" ? "moon-o" : "sun-o"} />
									&nbsp;
									{theme === "light" ? <>Dark</> : <>Light</>}&nbsp;Mode
								</Dropdown.Item>
								<Dropdown.Item onClick={showLogoutModal}>
									<Icon icon='sign-out' />
									&nbsp;Sign out
								</Dropdown.Item>
							</Dropdown>
						</Nav>

						<Nav pullRight id='nav-switch'>
							<Nav.Item onClick={handleToggle} style={{ width: 56, textAlign: "center" }}>
								<Icon icon={expanded ? "angle-left" : "angle-right"} />
							</Nav.Item>
						</Nav>
					</Navbar.Body>
				</Navbar>
			</Sidebar>
		</div>
	);
};

const iconStyles = {
	width: 56,
	height: 56,
	lineHeight: "56px",
};

export default PrimaryComponent;
