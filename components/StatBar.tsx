// components/StatBar.tsx — Meta-Style Animated Stats Bar

import React from "react";
import { useSprings, animated } from "@react-spring/web";
import { StatBarWrapper, StatItem } from "../styles/metaHomeStyles";

const stats = [
  { label: "Jump2s Created", number: 1187542 },
  { label: "Creators Using Jump2", number: 4821 },
  { label: "Links Shared Today", number: 21673 },
];

const StatBar = () => {
  const springs = useSprings(
    stats.length,
    stats.map(stat => ({
      from: { val: 0 },
      to: { val: stat.number },
      config: { tension: 80, friction: 20 },
    }))
  );

  return (
    <StatBarWrapper>
      {springs.map((props, i) => (
        <StatItem key={i}>
          <animated.span>
            {props.val.to((val: number) => Math.floor(val).toLocaleString())}
          </animated.span>
          <span className="label">{stats[i].label}</span>
        </StatItem>
      ))}
    </StatBarWrapper>
  );
};

export default StatBar;
