import React, { Component } from 'react';

import { Button, Input } from 'reactstrap';

export class Route extends Component {
	constructor(props) {
		super(props)
		this.state = {
			"last": this.props.uuid === this.props.last
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.removeRoute = this.removeRoute.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.props.updateRoute(this.props.uuid,name,value)
	}

	removeRoute() {
		this.props.removeRoute(this.props.uuid)
	}

	render() {
		let operator = <Button size="sm" onClick={this.removeRoute}>-</Button>
		if(this.state.last) {
			operator = <Button size="sm" onClick={this.props.addRoute}>+</Button>
		}
		return (
			<tr>
				<td><i className="far fa-circle"></i></td>
				<td><i className="far fa-circle"></i></td>
				<td>
					<Input name="label" value={this.props.details.label} type="text" size="sm" onChange={this.handleInputChange}/>
				</td>
				<td>
					<Input name="incomingip" size="sm" onChange={this.handleInputChange}/>
				</td>
				<td><Input name="incomingport" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="incomingpath" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="incomingmin" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="incomingmax" size="sm" onChange={this.handleInputChange}/></td>
				<td>&gt;</td>
				<td><i className="far fa-circle"></i></td>
				<td><i className="far fa-circle"></i></td>
				<td><Input name="outgoingip" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="outgoingport" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="outgoingpath" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="outgoingmin" size="sm" onChange={this.handleInputChange}/></td>
				<td><Input name="outgoingmax" size="sm" onChange={this.handleInputChange}/></td>
				<td>{operator}</td>
			</tr>
		)
	}
}