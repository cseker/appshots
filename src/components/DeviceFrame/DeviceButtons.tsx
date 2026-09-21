/**
 * Device Button Components
 *
 * Components for rendering physical device buttons (power, volume, etc.)
 * Supports both iPhone and Samsung button layouts, with flat and 3D styles.
 */

import type { DeviceColor } from "../../types";
import { getButtonBackground } from "./utils";

interface DeviceButtonProps {
  /** Button position on the device frame */
  position: "left" | "right" | "top" | "bottom";
  /** CSS top/bottom/left/right positioning */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** Length of the button (height for side buttons, width for top/bottom buttons) */
  length: string;
  /** Device color configuration for styling */
  color: DeviceColor;
  /** Whether to render in 3D style */
  is3d?: boolean;
}

/**
 * DeviceButton - Reusable device button component
 */
export const DeviceButton = ({
  position,
  top,
  bottom,
  left,
  right,
  length,
  color,
  is3d = false,
}: DeviceButtonProps) => {
  const isRight = position === "right";
  const isLeft = position === "left";
  const isTop = position === "top";
  const isBottom = position === "bottom";

  const bg = getButtonBackground(color, position);

  const style: React.CSSProperties = {
    background: bg,
    top,
    bottom,
    left,
    right,
  };

  const isVertical = isLeft || isRight;

  if (isVertical) {
    style.height = length;
    style.width = "0.8%";
    if (isLeft) style.left = "-0.8%";
    if (isRight) style.right = "-0.8%";
  } else {
    style.width = length;
    style.height = "0.8%";
    if (isTop) style.top = "-0.8%";
    if (isBottom) style.bottom = "-0.8%";
  }

  if (is3d) {
    if (isVertical) {
      style.width = "0.9%";
      style.borderRadius = isRight ? "0 3px 3px 0" : "3px 0 0 3px";
      if (isLeft) style.left = "-0.9%";
      if (isRight) style.right = "-0.9%";
    } else {
      style.height = "0.9%";
      style.borderRadius = isBottom ? "0 0 3px 3px" : "3px 3px 0 0";
      if (isTop) style.top = "-0.9%";
      if (isBottom) style.bottom = "-0.9%";
    }

    return (
      <div
        className="absolute"
        style={{
          ...style,
          transformStyle: "preserve-3d",
          transform: `translateZ(4px)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            background: bg,
            boxShadow: isVertical
              ? (isRight
                  ? `inset -1px 0 1px rgba(255,255,255,0.25), inset 1px 0 2px rgba(0,0,0,0.2), 2px 0 4px rgba(0,0,0,0.3)`
                  : `inset 1px 0 1px rgba(255,255,255,0.25), inset -1px 0 2px rgba(0,0,0,0.2), -2px 0 4px rgba(0,0,0,0.3)`)
              : (isBottom
                  ? `inset 0 -1px 1px rgba(255,255,255,0.25), inset 0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)`
                  : `inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.2), 0 -2px 4px rgba(0,0,0,0.3)`),
          }}
        />
      </div>
    );
  }

  // Flat mode
  if (isVertical) {
    style.boxShadow = isRight
      ? "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)"
      : "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)";
  } else {
    style.boxShadow = isBottom
      ? "inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)"
      : "inset 0 -1px 2px rgba(255,255,255,0.3), 0 -2px 4px rgba(0,0,0,0.2)";
  }

  const roundedClass = isRight
    ? "rounded-r-xs"
    : isLeft
      ? "rounded-l-xs"
      : isTop
        ? "rounded-t-xs"
        : "rounded-b-xs";

  return <div className={`absolute ${roundedClass}`} style={style} />;
};

interface DeviceButtonsProps {
  /** Device color configuration */
  color: DeviceColor;
  /** Whether to render in 3D style */
  is3d?: boolean;
}

/**
 * IPhoneButtons - iPhone button layout
 *
 * - Right side: Side button (power)
 * - Left side: Silent switch, Volume up, Volume down
 */
export const IPhoneButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Side button (power) - right */}
    <DeviceButton position="right" top="18%" length="8%" color={color} is3d={is3d} />
    {/* Silent switch - left */}
    <DeviceButton position="left" top="15%" length="4%" color={color} is3d={is3d} />
    {/* Volume up - left */}
    <DeviceButton position="left" top="21%" length="6%" color={color} is3d={is3d} />
    {/* Volume down - left */}
    <DeviceButton position="left" top="28%" length="6%" color={color} is3d={is3d} />
  </>
);

export const SamsungButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Power button - right */}
    <DeviceButton position="right" top="22%" length="5%" color={color} is3d={is3d} />
    {/* Volume up - right */}
    <DeviceButton position="right" top="29%" length="6%" color={color} is3d={is3d} />
    {/* Volume down - right */}
    <DeviceButton position="right" top="36%" length="6%" color={color} is3d={is3d} />
  </>
);

/**
 * IPadButtons - iPad Pro button layout (Portrait)
 * Power on top right edge, volume on right edge near top
 */
export const IPadButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Power button - top edge, right side */}
    <DeviceButton position="top" right="8%" length="6%" color={color} is3d={is3d} />
    {/* Volume up/down - right edge, near top */}
    <DeviceButton position="right" top="6%" length="4%" color={color} is3d={is3d} />
    <DeviceButton position="right" top="11%" length="4%" color={color} is3d={is3d} />
  </>
);

/**
 * IPadLandscapeButtons - iPad Pro button layout (Landscape)
 * Power on left edge near top, volume on top edge near left
 */
export const IPadLandscapeButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Power button - left edge, near top */}
    <DeviceButton position="left" top="8%" length="6%" color={color} is3d={is3d} />
    {/* Volume up/down - top edge, near left */}
    <DeviceButton position="top" left="6%" length="4%" color={color} is3d={is3d} />
    <DeviceButton position="top" left="11%" length="4%" color={color} is3d={is3d} />
  </>
);
