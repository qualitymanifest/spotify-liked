import { h } from "preact";
import throttle from "lodash.throttle";

import style from "./style";

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

const handleTouchMove = e => {
  throttledMove.call(this, e);
  e.preventDefault();
};

const QuickScroll = ({ letters }) => (
  <div onTouchMove={handleTouchMove} className={style.scrollbar}>
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
