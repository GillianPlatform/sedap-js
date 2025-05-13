import styled from "styled-components";

const Wrap = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.$visible ? "1" : "0")};
  transition: opacity 0.1s ease-in-out;
  position: relative;
  left: 50%;
  top: -10px;
  transform: translate(-50%, -100%);
  position: absolute;
`;

const Content = styled.div`
  background-color: var(--tooltip-background, black);
  border-radius: 5px;
  padding: 3px 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Item = styled.div`
  padding: 5px;
`;

// https://css-tricks.com/snippets/css/css-triangle/
const ArrowUp = styled.div`
  --arrowHeight: 10px;
  width: 0;
  height: 0;
  border-left: calc(var(--arrowHeight) / 2) solid transparent;
  border-right: calc(var(--arrowHeight) / 2) solid transparent;
  border-top: var(--arrowHeight) solid var(--tooltip-background, black);
`;

export type TooltipProps = {
  visible: boolean;
  children: React.ReactNode[];
};

const Tooltip = ({ visible, children }: TooltipProps) => (
  <Wrap $visible={visible} className="sedap__nodeTooltip">
    <Content className="sedap__nodeTooltipContent">
      {children.map((c) => (
        // eslint-disable-next-line react/jsx-key
        <Item className="sedap__nodeTooltipItem">{c}</Item>
      ))}
    </Content>
    <ArrowUp className="sedap__nodeTooltipArrow" />
  </Wrap>
);

export default Tooltip;
