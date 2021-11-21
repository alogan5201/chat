import React from "react";
import { Icon } from "framework7-react";

export default function OnlineIcon(props) {
  const { size = 15 } = props;
  return (
    <span className="online-icon">
      <Icon f7="circle_fill" size={size} color="red" />
    </span>
  );
}
