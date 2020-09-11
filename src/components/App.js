import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem';
import AddLogItem from './AddLogItem';
import {ipcRenderer} from 'electron';
const App = () => {
	const [logs, setLogs] = useState([]);
	const [alert, setAlert] = useState({
		show: false,
		variant: "success",
		message: ""
	})

	useEffect(() => {
		ipcRenderer.send('logs:load')
		ipcRenderer.on('logs:get', (e, logs) => {
			let logsArr;
			try {
				logsArr = JSON.parse(logs);
			} catch (error) {
				logsArr = [];
			}
			setLogs(logsArr)
		
		} )
		ipcRenderer.on('logs:clear', () => {
			setLogs([])
		} )
	}, [])	
	const showAlert = (message, variant = "success", time = 2000) => {
		setAlert({
			show: true,
			message,
			variant,
		})
		setTimeout(() => {
			setAlert({
				show: false,
				message: "",
				variant: "success",
			})
		}, time)

	}
	const addItem = (testStatus, item) => {
		if(!testStatus){
			return showAlert("Please enter total input correctly!", "danger");
		}
		ipcRenderer.send('logs:add', item);
		setLogs([
			{
				_id: Math.floor(Math.random() * 100000),
				name: item.name,
				priority: item.priority,
				user: item.user,
				created: new Date().toString()
			},
			...logs
		])
		showAlert("Add Log Successfully!")
	}

	const deleteItem = (_id) => {
		ipcRenderer.send('logs:delete', _id);
		setLogs(logs.filter(log => {
			return log._id !== _id;
		}))
		showAlert("Delete completely", "warning")
	}

	return (
		<Container>
			<AddLogItem addItem={addItem}></AddLogItem>
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Priority</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{logs.map(log => {
						return <LogItem deleteItem={deleteItem} key={log._id} log={log}></LogItem>
					})}
				</tbody>
			</Table>
		</Container>
	)
}

export default App
