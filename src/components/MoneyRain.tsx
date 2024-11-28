import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const MoneyContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
`;

const symbols = ["💰", "💵", "💸", "$", "€", "£", "¥", "₿"];

const MoneyRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbolsCount = 50;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from({ length: symbolsCount }, () => {
      const symbol = document.createElement("div");
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const x = Math.random() * 100;
      const delay = Math.random() * 5;

      symbol.style.cssText = `
        position: absolute;
        left: ${x}%;
        color: #00ff00;
        font-size: 24px;
        opacity: 0.7;
        animation: fall ${Math.random() * 3 + 2}s linear infinite;
        animation-delay: ${delay}s;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      `;
      symbol.textContent = randomSymbol;
      return symbol;
    });

    elements.forEach((element) => container.appendChild(element));

    return () => {
      elements.forEach((element) => element.remove());
    };
  }, []);

  return <MoneyContainer ref={containerRef} />;
};

export default MoneyRain;
