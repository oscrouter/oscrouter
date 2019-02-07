import React, { Component } from 'react';

import { Button, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Route } from './Route.js';

export class Routes extends Component {
	constructor(props) {
		super(props)

		this.state = {
			tcpsettings: false,
			tooltipOpen: false
		}

		this.toggleTCPSettings = this.toggleTCPSettings.bind(this);
		this.apply = this.apply.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	toggleTCPSettings() {
		this.setState(prevState => ({
			tcpsettings: !prevState.tcpsettings
		}));
	}

	toggle(event) {
		console.log(event)
		this.setState(prevState => ({
			tooltipOpen: !prevState.tooltipOpen
		}));
	}

	apply() {
		this.props.apply()
	}
	render() {
		return (
			<Row>
				<Col className="routes">
					<Row>
						<Col>
							<Table borderless>
								<thead>
									<tr>
										<th></th>
										<th></th>
										<th>Label</th>
										<th>Incoming IP</th>
										<th>Port</th>
										<th>Path</th>
										<th>Min</th>
										<th>Max</th>
										<th></th>
										<th></th>
										<th></th>
										<th>Outgoing IP</th>
										<th>Port</th>
										<th>Path</th>
										<th>Min</th>
										<th>Max</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{Object.keys(this.props.routes).map(key =>
										<Route key={key} uuid={key} details={this.props.routes[key]} updateRoute={this.props.updateRoute} addRoute={this.props.addRoute} last={Object.keys(this.props.routes)[Object.keys(this.props.routes).length - 1]}/>
									)}
								</tbody>
							</Table>
						</Col>
					</Row>
					<Row className="justify-content-end">
						<Col sm={{ size: 'auto', offset: 11 }}>
							<Button size="sm" onClick={this.toggleTCPSettings}>TCP Settings...</Button>
						</Col>
					</Row>
					<Row className="justify-content-end">
						<Col sm={{ size: 'auto', offset: 11 }}>
							<Button size="sm" onClick={this.apply}>Apply</Button>
						</Col>
					</Row>
					<Modal isOpen={this.state.tcpsettings} toggle={this.toggleTCPSettings} className={this.props.className}>
						<ModalHeader toggle={this.toggleTCPSettings}>Modal title</ModalHeader>
						<ModalBody>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</ModalBody>
						<ModalFooter>
						<Button color="primary" onClick={this.toggleTCPSettings}>Do Something</Button>{' '}
						<Button color="secondary" onClick={this.toggleTCPSettings}>Cancel</Button>
					</ModalFooter>
				</Modal>
				</Col>
			</Row>
		)
	}
}