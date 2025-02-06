import { ReactNode } from "react";
import styled from "styled-components";
import IconButton from "./IconButton";
import { VscClose } from "react-icons/vsc";

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TitleList = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 1em;
  gap: 2em;
  height: 3em;
`;

const ViewWrap = styled.div`
  width: 100%;
  height: 100%;
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  gap: 0.25em;
  padding: 0 0.25em;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  color: var(--panel-tab-foreground);

  &.selected {
    color: var(--panel-tab-active-foreground);
    border-bottom-color: var(--panel-tab-active-border);
  }

  &:hover {
    color: var(--panel-tab-active-foreground);
  }
`;

export type Tab = {
  id: string;
  name: string;
  content: ReactNode;
  onClose?: () => void;
};

export type TabsProps = {
  activeId?: string | undefined;
  tabs: Tab[];
  onChange: (id: string) => void;
  children?: ReactNode;
};

export default function Tabs({ activeId, tabs, onChange, children }: TabsProps) {
  const titles: ReactNode[] = [];
  const views: ReactNode[] = [];
  let foundActive = false;
  for (const { id, name, onClose, content } of tabs) {
    const isActive = id === activeId;
    if (isActive) {
      foundActive = true;
    }
    titles.push(
      <TitleWrap
        key={`title-${id}`}
        className={isActive ? "selected" : ""}
        onClick={() => onChange(id)}
      >
        {name}
        {onClose && (
          <IconButton
            onClick={() => {
              onClose();
            }}
          >
            <VscClose />
          </IconButton>
        )}
      </TitleWrap>,
    );
    views.push(
      <ViewWrap key={`view-${id}`} style={isActive ? {} : { display: "none" }}>
        {content}
      </ViewWrap>,
    );
  }
  if (!foundActive) {
    views.push(children);
  }
  return (
    <Wrap>
      <TitleList>{titles}</TitleList>
      {views}
    </Wrap>
  );
}
