import React from 'react'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Moment from 'react-moment'

const LogItem = (props) => {
    const setVariant = () => {
        if(props.log.priority === "low"){
            return "success";
        }
        else if(props.log.priority === "moderate"){
            return "warning";
        }
        else{
            return "danger";
        }
    }
    const deleteItem = () => {
        props.deleteItem(props.log._id)
    }
    return (
        <tr>
            <td>{props.log._id}</td>
            <td>{props.log.name.charAt(0).toUpperCase() + props.log.name.slice(1)}</td>
            <td>
                <Badge variant={setVariant()}  className="p-2">
                    {props.log.priority}
                </Badge>
            </td>
            <td>{props.log.user}</td>
            <td><Moment format="MMMM Do YYYY, h:mm:ss a">{props.log.created}</Moment></td>
            <td>
                <Button variant="danger" onClick={deleteItem}>
                    X
                </Button>
            </td>
        </tr>
    )
}

export default LogItem
