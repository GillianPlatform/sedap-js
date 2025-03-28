import { ReactElement } from "react";
import NodeBadge from "./NodeBadge";
import { MapNodeExtra } from "@gillianplatform/sedap-types";

export default function renderExtras(extras: MapNodeExtra[]): ReactElement[] {
  return extras.map((extra) => {
    switch (extra.kind) {
      case "badge": {
        return <NodeBadge {...extra} />;
      }
    }
  });
}
