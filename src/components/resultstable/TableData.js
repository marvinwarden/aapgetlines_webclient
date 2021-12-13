import React from 'react';

export default function TableData(props) {
  return (
    <tbody>
      <tr>
        <td>{props.project}</td>
        <td>{props.episode}</td>
        <td>{props.character}</td>
        <td>{props.tc_in}</td>
        <td>{props.tc_out}</td>
        <td>{props.line}</td>
      </tr>
    </tbody>
  );
}
