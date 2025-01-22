import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Trace View",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    root: "llen_root",
    initExpandedNodes: ["5"],
    reactFlowProps: {
      colorMode: "light",
    },
    nodes: {
      llen_root: {
        id: "llen_root",
        next: {
          kind: "single",
          id: "1",
        },
        options: {
          kind: "root",
          title: "llen()",
        },
      },
      "1": {
        id: "1",
        next: {
          kind: "branch",
          cases: [
            {
              branchLabel: "true",
              branchCase: {},
              id: "2",
            },
            {
              branchLabel: "false",
              branchCase: {},
              id: "4",
            },
          ],
        },
        options: {
          kind: "basic",
          display: "if (x = null)",
        },
      },
      "2": {
        id: "2",
        next: {
          kind: "single",
          id: "3a",
        },
        options: {
          kind: "basic",
          display: "n := 0",
        },
      },
      "3a": {
        id: "3a",
        next: {
          kind: "single",
          id: "3",
        },
        options: {
          kind: "basic",
          display: "skip",
        },
      },
      "3": {
        id: "3",
        next: { kind: "final" },
        options: {
          kind: "basic",
          display: "return n",
        },
      },
      "4": {
        id: "4",
        next: {
          kind: "single",
          id: "5",
        },
        options: {
          kind: "basic",
          display: "t := [x+1]",
        },
      },
      "5": {
        id: "5",
        submaps: ["match1"],
        next: {
          kind: "single",
          id: "8",
        },
        options: {
          kind: "basic",
          display: "n := llen(t)",
          extras: [
            {
              kind: "badge",
              text: "Match",
              tag: "success",
            },
          ],
        },
      },
      match1: {
        id: "match1",
        next: {
          kind: "single",
          id: "6",
        },
        options: {
          kind: "root",
          title: "Match",
          subtitle: "llen() precondition",
        },
      },
      "6": {
        id: "6",
        next: {
          kind: "single",
          id: "7",
        },
        options: {
          kind: "basic",
          display: "<some assertion>",
        },
      },
      "7": {
        id: "7",
        next: {
          kind: "final",
        },
        options: {
          kind: "basic",
          display: "Success",
          selectable: false,
        },
      },
      "8": {
        id: "8",
        next: {
          kind: "single",
          id: null,
        },
        options: {
          kind: "basic",
          display: "n := n + 1",
        },
      },
    },
  },
};
