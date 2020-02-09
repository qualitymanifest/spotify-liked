import { h, createRef } from "preact";
import throttle from "lodash.throttle";

import style from "./style";

const quickScrollRef = createRef();

const scrollToLetter = element => {
  if (!element || !element.dataset || !element.dataset.letter) return;
  document
    .getElementsByClassName(element.dataset.letter)[0]
    .scrollIntoView({ block: "center" });
};

const handleClick = e => {
  scrollToLetter(e.target);
};

const handleMouseEnter = e => {
  if (e.buttons === 0) return;
  handleClick(e);
};

const throttledMove = throttle(e => {
  const { clientX, clientY } = e.changedTouches[0];
  const currentEl = document.elementFromPoint(clientX, clientY);
  scrollToLetter(currentEl);
}, 100);

const handleTouchStart = e => {
  quickScrollRef.current.classList.add(style.scrolling);
  scrollToLetter(e.target);
};

const handleTouchMove = e => {
  throttledMove(e);
  e.preventDefault();
};

const handleTouchEnd = e => {
  quickScrollRef.current.classList.remove(style.scrolling);
};

const QuickScroll = ({ letters }) => (
  <div
    ref={quickScrollRef}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    className={style.quickScroll}
  >
    {letters.map(letter => (
      <span
        className={style.letter}
        data-letter={letter}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {letter}
      </span>
    ))}
  </div>
);

export default QuickScroll;
