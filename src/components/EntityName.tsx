import * as React from "react";
import { Tag, Icon } from "antd";
import { entityNames } from "./entities";
import { getRandomColor } from "./colors";

interface EntityNameProps {
    name: string,
    value: string,
}

interface EntityNameState {
}

export class EntityName extends React.Component<EntityNameProps, EntityNameState> {

    render () {
        const {name, value} = this.props;
        return (
            <span
                style={{
                    backgroundColor: getRandomColor(name),
                    padding: "5px",
                    marginRight: "5px",
                    borderRadius: "5px",
                }}
            >
                {entityNames.indexOf(name) === -1 ? (
                    <Icon
                        type="exclamation-circle"
                        title="这个实体还未在实体界面添加！"
                        style={{ marginRight: "5px" }}
                    />
                ) : null}
                {name} : {value}
            </span>
        );
    }

}