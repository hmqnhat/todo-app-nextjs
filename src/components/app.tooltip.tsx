import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

interface ITooltipProps {
    children: any;
    header: string;
    content: string;
}

export default function TooltipOverlay({ children, header, content }: ITooltipProps) {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">{header}</Popover.Header>
            <Popover.Body>{content}</Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={popover}>
            {children}
        </OverlayTrigger>
    )
}