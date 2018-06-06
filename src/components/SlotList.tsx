import * as React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { getEntities, setEntities } from "./entities";

const Columns = [
    {
        key: "name",
        dataIndex: "name",
        title: "名称",
        render: t => <Link to={`/slot/${t}`}>{ t }</Link>,
    },
    {
        key: "count",
        dataIndex: "count",
        title: "数量",
    },
];

export default class SlotList extends React.Component {

    render () {
        const entities = getEntities();
        return (
            <div>
                <h1>SLot List Page</h1>
                <div>
                    <Table
                        columns={Columns}
                        dataSource={entities.map(item => {
                            return {
                                key: item.entity,
                                name: item.entity,
                                count: item.data.length,
                            };
                        })}
                    />
                </div>
            </div>
        );
    }
    
}