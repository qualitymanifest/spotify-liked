import { h, createRef } from "preact";
import throttle from "lodash.throttle";

import style from "./style";

const scrollbar = createRef();

const handleClick = e => {
  const { letter } = e.target.dataset;
  document.querySelector(`.${letter}`).scrollIntoView({ block: "center" });
};

const handleMouseEnter = e => {
  if (e.buttons === 0) return;
  handleClick(e);
};

const throttledMove = throttle(e => {
  const { clientX, clientY } = e.changedTouches[0];
  const currentEl = document.elementFromPoint(clientX, clientY);
  if (!currentEl) return;
  const { letter } = currentEl.dataset;
  if (!letter) return;
  document.querySelector(`.${letter}`).scrollIntoView({ block: "center" });
}, 100);

const handleTouchStart = e => {
  scrollbar.current.classList.add(style.scrolling);
};

const handleTouchMove = e => {
  throttledMove(e);
  e.preventDefault();
};

const handleTouchEnd = e => {
  scrollbar.current.classList.remove(style.scrolling);
};

const QuickScroll = ({ letters }) => (
  <div
    ref={scrollbar}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    className={style.scrollbar}
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
