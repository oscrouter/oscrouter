import React, { Component } from 'react';
import './css/App.css';
import { Button, Container, Row, Col } from 'reactstrap';
import openSocket from 'socket.io-client';
import { Routes } from './Routes.js';
import uuidv4 from 'uuid/v4';

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			socket: openSocket('http://localhost:1337'),
			tcpsettings: false,
			routes: {
				"9cb5d8de-5f9d-46ae-b62c-b64425954500": {
					label: 'hi'
				}
			},
			value: '',
			tooltipOpen: false
		}

		this.state.socket.on('board', board => {

		});

		this.updateRoute = this.updateRoute.bind(this);
		this.apply = this.apply.bind(this);
	}

	removeRoute = route => {
		const routes = {...this.state.routes}

		delete(routes[route])

		this.setState({
			routes
		});
	}

	updateRoute(uuid, param, value) {
		const routes = {...this.state.routes}

		routes[uuid][param] = value

		this.setState({
			routes
		});
	}

	addRoute = route => {
		const routes = {...this.state.routes}

		routes[uuidv4()] = {}

		this.setState({
			routes
		});
	}

	apply() {
		this.state.socket.emit('apply', {routes: this.state.routes});
	}

	render() {
		return (
			<div>
				<Container fluid>
					<Routes addRoute={this.addRoute} routes={this.state.routes} apply={this.apply} updateRoute={this.updateRoute}/>
					<Row>
						<Col>
							<div className="logs">
								Wed 06 Feb 2019 [0:25:17] OSCRouter v0.11
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button className="btn-wide" size="sm">New</Button>
						</Col>
						<Col>
							<Button className="btn-wide" size="sm">Open</Button>
						</Col>
						<Col>
							<Button className="btn-wide" size="sm">Save</Button>
						</Col>
						<Col>
							<Button className="btn-wide" size="sm">Save As...</Button>
						</Col>
						<Col>
							<Button className="btn-wide" size="sm">Clear Log</Button>
						</Col>
						<Col>
							<Button className="btn-wide" size="sm">View Log</Button>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default App;
