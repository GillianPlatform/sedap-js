import React, { FC } from "react";
import TraceView, { TraceViewProps } from "../TraceView";

const Example: FC<TraceViewProps> = (props) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 32px)",
        }}
      >
        <TraceView {...props} />
      </div>
    </>
  );
};

export default Example;
